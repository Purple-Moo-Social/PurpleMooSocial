//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\index.tsx
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to Deuces
      </Text>
      <Link href='/login' asChild>
        <Pressable style={{
          backgroundColor: '#000',
          padding: 15,
          borderRadius: 5
        }}>
          <Text style={{ color: 'FFD700' }}>Go to Login</Text>
        </Pressable>
      </Link>
    </View>
  );
}