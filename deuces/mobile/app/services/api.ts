// deuces\mobile\app\services\api.ts
import { tokenStorage } from "../lib/auth";
import { CONFIG } from "../../src/config";

const API_URL = CONFIG.apiUrl;

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: { id: string; emai?: string };
}

const handleRequest = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const authApi = {
  register: async (email: string, password: string, username: string) => {
    return handleRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });
  },

  login: async (email: string, password: string) => {
    const tokens = await handleRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await tokenStorage.saveTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    return tokens;
  },

  logout: async () => {
    await tokenStorage.clearTokens();
  },

  protected: async () => {
    const token = await tokenStorage.getAccessToken();
    const response = await fetch(`${API_URL}/auth/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Protected route failed");
    return response.json();
  },

  refresh: async (refreshToken: string) => {
    return handleRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};

export default function ApiPlaceholder() {
  return null;
}
