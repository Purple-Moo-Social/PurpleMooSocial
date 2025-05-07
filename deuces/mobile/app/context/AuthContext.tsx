//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\context\AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenStorage } from '../lib/auth';
import { router } from 'expo-router';
import { isAxiosError } from 'axios';
import { authApi } from '../services/api';

// Type definitions
interface UserData {
  email: string;
  id: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: { id: string };
}

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
};

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type guard for auth responses
function isAuthResponse(data: any): data is AuthResponse {
  return (
    typeof data?.access_token === 'string' &&
    typeof data?.refresh_token === 'string' &&
    typeof data?.user?.id === 'string'
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null
  });

  const handleTokenRefresh = async (): Promise<boolean> => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) return false;

      const response = await authApi.refresh(refreshToken);
      if (!isAuthResponse(response.data)) return false;

      await tokenStorage.saveTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
      return true;
    } catch (error) {
      console.log('Token refresh failed:', error);
      return false;
    }
  };

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      await tokenStorage.clearTokens();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      router.replace('/login');
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const token = await tokenStorage.getAccessToken();
     
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.protected();
        setState({
          isLoading: false,
          isAuthenticated: true,
          user: {
            email: response.data.user.email,
            id: response.data.user.sub
          }
        });
      } catch (error) {
        if (await handleTokenRefresh()) {
          await checkAuth(); // Retry with new token
        } else {
          throw error;
        }
      }
    } catch(error) {
      console.log('Auth check failed:', error);
      await logout();
    }
  }, [logout]);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login(email, password);

      if (!isAuthResponse(response.data)) {
        throw new Error('Invalid login response format');
      }

      await tokenStorage.saveTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          email,
          id: response.data.user.id
        }
      });

      router.replace('/(tabs)/home');
    } catch(error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  

  const register = async (email: string, password: string, username: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.register(email, password, username);

      if (!isAuthResponse(response.data)) {
        throw new Error('Invalid registration response format');
      }

      await tokenStorage.saveTokens({
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          email,
          id: response.data.user.id
        }
      });
      router.replace('/(tabs)/home');
    } catch(error) {
      setState(prev => ({ ...prev, isLoading: false }));
      
      if (isAxiosError(error)) {
        console.log("Registration failed:", {
          status: error.response?.status,
          data: error.response?.data,
          stack: error.stack
        });
      }
      throw error;
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default function AuthContextProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AuthProvider>{children}</AuthProvider>;
}