// deuces\mobile\app\context\AuthContext.tsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenStorage } from '../lib/auth';
import { useRouter } from 'expo-router';
import { authApi } from '../services/api';
import { Alert } from 'react-native';

// Type definitions
interface UserData {
  email: string;
  id: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserData | null;
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null
  });

  


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
      router.replace('/(auth)/login');
    }
  }, [router]);

  const handleTokenRefresh = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token available');
        return false;
      }
      
      console.log('Attempting token refresh...');
      const { access_token, refresh_token, user } = await authApi.refresh(refreshToken);
      
      if(!user?.email || !user?.id) {
        throw new Error('Invalid user data in refresh response');
      }

      await tokenStorage.saveTokens({
        accessToken: access_token,
        refreshToken: refresh_token
      });

      setState({
        isLoading: false,
        isAuthenticated: true,
        user : {
          id: user.id,
          email: user.email
        }
      });
      console.log('Token refresh successful');
      return true;
    } catch (error) {
      console.log('Token refresh failed:', error instanceof Error ? error.message : error);
      await tokenStorage.clearTokens();
      return false;
    }
  }, []);

    

  const checkAuth = useCallback(async () => {
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const token = await tokenStorage.getAccessToken();
     
      if (!token) {
        console.log('No access token found');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log('Checking protected endpoint...');
      try {
        const { user } = await authApi.protected();
        console.log('Protected endpoint success, user:', user);
        setState({
          isLoading: false,
          isAuthenticated: true,
          user: {
            email: user.email,
            id: user.sub
          }
        });
      } catch(error){
        console.log('Protected endpoint failed, attempting refresh...', error);
        const refreshSuccess = await handleTokenRefresh();
        if(refreshSuccess) {
          await checkAuth();
        } else {
          await logout();
        }
      }
    } catch(error) {
      console.log('Auth check failed:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [logout, handleTokenRefresh]);


  

  const login = async (email: string, password: string) => {
    
    try {
      console.log('Attempting login with:', { email, password });
      setState(prev => ({ ...prev, isLoading: true }));

      const { access_token, refresh_token, user } = await authApi.login(email, password);
      
      if(!access_token || !refresh_token || !user?.id) {
        throw new Error('Invalid login response');
      }
      console.log('Login API response:', { access_token: !!access_token, user });

      await tokenStorage.saveTokens({
        accessToken: access_token,
        refreshToken: refresh_token
      });

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          email,
          id: user.id
        }
      });

      await new Promise(resolve => setTimeout(resolve, 50));
      router.replace('/(tabs)/home');
    } catch(error) {
      console.error('Login failed:', {
        message: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      setState({isLoading: false, isAuthenticated: false, user: null });
      Alert.alert('Error', 'Invalid email or password');
      return;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      console.log('Starting registration...');
      
      
      const { access_token, refresh_token, user } = await authApi.register(email, password, username.trim());
      console.log('Registration API success, tokens:', {
        access_token: !!access_token,
        refresh_token: !!refresh_token
      });

      if(!access_token || !refresh_token) {
        throw new Error('Server did not return valid tokens');
      }

      await tokenStorage.saveTokens({
        accessToken: access_token,
        refreshToken: refresh_token
      });
      console.log('Tokens saved to storage');

      // verifying tokens were saved
      const storedAccess = await tokenStorage.getAccessToken();
      const storedRefresh = await tokenStorage.getRefreshToken();
      console.log('[Register] Tokens verified:', {
        storedAccess: !!storedAccess,
        storedRefresh: !!storedRefresh
      });

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: {
          email,
          id: user.id
        }
      });
      console.log('Auth state updated, navigating...');
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('[Register] Navigating to home...');
      router.replace('/(tabs)/home');
    } catch(error) {
      console.error('Registration error:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      console.error('Registration error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      Alert.alert('Error', 'Registration failed. Please try again.');
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

export default function AuthContextProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AuthProvider>{children}</AuthProvider>;
}