// deuces\mobile\app\(tabs)\profile.tsx
import { View, Text, Pressable } from 'react-native';
import {  useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to Deuces
      </Text>
        <Pressable 
        onPress={handleLogout}
        style={{
          backgroundColor: '#000',
          padding: 15,
          borderRadius: 5
        }}>
          <Text style={{ color: 'white' }}>Logout</Text>
        </Pressable>
    </View>
  );
}