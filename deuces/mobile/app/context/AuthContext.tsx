import React, { createContext, useContext, useEffect, useState } from 'react';
import { tokenStorage } from '../lib/auth';
import { router } from 'expo-router';
import { authApi } from '../services/api';

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    email: string | null;
    id: string | null;
  } | null;
};

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null
  });

  const checkAuth = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const isLoggedIn = await tokenStorage.isLoggedIn();
      if(!isLoggedIn) {
        throw new Error('No token found');
      }

      const response = await authApi.protected();

      setState({
        isLoading: false, 
        isAuthenticated: true,
        user: {
          email: response.data.user.email,
          id: response.data.user.sub
        }
      });
    } catch(error) {
      await tokenStorage.clearTokens();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authApi.login(email, password);

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          email: email, 
          id: response.data.user.id
        }
      });

      router.replace({ pathname: '../(tabs)/home' });
    }catch(error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setState({
      isLoading: false,
      isAuthenticated: false,
      user: null
    });
    router.replace({ pathname: '../login' });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if(context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};