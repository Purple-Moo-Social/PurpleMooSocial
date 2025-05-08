//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\services\api.ts
import axios, { AxiosResponse } from "axios";
import { tokenStorage } from "../lib/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.42:3000";

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: { id: string };
}

interface AuthApi {
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<AxiosResponse<AuthResponse>>;
  login: (
    email: string,
    password: string
  ) => Promise<AxiosResponse<AuthResponse>>;
  logout: () => Promise<void>;
  protected: () => Promise<
    AxiosResponse<{ user: { email: string; sub: string } }>
  >;
  refresh: (refreshToken: string) => Promise<AxiosResponse<AuthResponse>>;
}

//create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Add request interceptor to inject tokens
api.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.log("API Timeout:", error.config.url);
      return Promise.reject(new Error("Request timeout. Please try again."));
    }

    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 && !originalRequest._retry) ||
      (error.response?.status === 400 &&
        error.response.data?.message?.includes("Username"))
    ) {
      originalRequest._retry = true;
      error.message = "Please remove spaces from username";

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authApi: AuthApi = {
  register: async (email: string, password: string, username: string) => {
    return api.post<AuthResponse>("/auth/register", {
      email,
      password,
      username,
    });
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    await tokenStorage.saveTokens({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
    return response;
  },
  logout: async () => {
    await tokenStorage.clearTokens();
  },
  protected: async () => {
    return await api.get("/auth/protected");
  },
  refresh: async (refreshToken: string) => {
    return api.post<AuthResponse>("/auth/refresh", { refreshToken });
  },
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default function ApiPlaceholder() {
  return null;
}
