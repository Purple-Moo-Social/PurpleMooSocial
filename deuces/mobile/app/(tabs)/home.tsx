// deuces\mobile\app\(tabs)\home.tsx
import { View, Text, Pressable } from 'react-native';
import { Redirect, Link } from 'expo-router';
import { useAuth } from '../context/AuthContext'

export default function HomeScreen() {
  const { state } = useAuth();

  if(!state.isAuthenticated) {
    return (
      <Redirect href='/(auth)/login' />
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'purple' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to Deuces
      </Text>
      <Link href='/(auth)/login' asChild>
        <Pressable style={{
          backgroundColor: '#000',
          padding: 15,
          borderRadius: 5
        }}>
          <Text style={{ color: 'FFD700' }}>Go to Login</Text>
        </Pressable>
      </Link>
      <Text style={{ fontSize: 20 }}>Welcome {state.user?.email}!</Text>
    </View>
  );
}