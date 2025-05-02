//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\login.tsx
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { View, TextInput, Pressable, Text, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { authApi } from './services/api';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, state } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch(error: unknown) {
      let message = 'Invalid credentials';
      if(error instanceof Error) {
        message = error.message;
      } else if( typeof error === 'object' && error !== null && 'response' in error) {
        message = (error as any).response?.data.message || 'Invalid credentials';
      }
      Alert.alert('Login Failed', message);
    } 
    };
  
  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 15,
          marginBottom: 15,
          borderRadius: 5
        }}
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <TextInput 
        placeholder='Password'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 15,
          marginBottom: 25,
          borderRadius: 5
        }}
      />
      <Pressable
        onPress={handleLogin}
        disabled={state.isLoading}
        style={{
          backgroundColor: '#000',
          padding: 15,
          borderRadius: 5,
          alignItems: 'center',
          opacity: state.isLoading ? 0.5 : 1
        }}
      >
        <Text style={{ color: '#FFD700', fontWeight: 'bold' }}>
          {state.isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </Pressable>
      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <Text style={{ marginBottom: 10 }}>
          Don't have an account?
        </Text>
        <Link href={{ pathname: "../register" }} asChild>
          <Pressable>
            <Text style={{ color: '#800020', fontWeight: 'bold' }}>
              Create Account
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}