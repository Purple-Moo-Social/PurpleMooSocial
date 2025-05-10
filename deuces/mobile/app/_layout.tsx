// deuces\mobile\app\_layout.tsx
import 'expo-dev-client';
import { Slot } from 'expo-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const { state } = useAuth();
  console.log('Auth state:', state);
  if(state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}