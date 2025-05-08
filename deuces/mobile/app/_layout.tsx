//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\_layout.tsx
import 'expo-dev-client';
import { Stack, Redirect } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function AuthLayout() {
  const { state } = useAuth();

  if(state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  if(!state.isAuthenticated) {
    return <Redirect href='/login'/>;
  }

  return (
    <Stack>
      <Stack.Screen 
        name='/(tabs)'
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name='modal'
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name='index'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name='login'
          options={{
            title: 'Login',
            presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name='register'
          options={{
            title: 'Register',
            presentation: 'modal'
          }}
        />
      </Stack>
      <AuthLayout />
    </AuthProvider>
  );
}