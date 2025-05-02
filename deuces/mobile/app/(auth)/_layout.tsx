//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\(auth)\_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
  const { state } = useAuth();

  // If authenticated, redirect away from auth pages
  if(state.isAuthenticated) {
    return <Redirect href={{ pathname: '../(tabs)/home'}} />;
  }

  return (
    <Stack>
      <Stack.Screen name='login' options={{ title: 'Login' }} />
      <Stack.Screen name='register' options={{ title: 'Register' }} />
      <Stack.Screen name='forgot-password' options={{ title: 'Reset Password' }}  />
    </Stack>
  );
}