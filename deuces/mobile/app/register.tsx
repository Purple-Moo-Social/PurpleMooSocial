//deuces\mobile\app\register.tsx
import { useState } from "react";
import { View, TextInput, Pressable, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from "./context/AuthContext";

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { register, state } = useAuth();

  const handleRegister = async () => {
    console.log('Attempting registration with:', { email, username });
    if(!email || !password || !username) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const trimUsername = username.trim(); 
      const response = await register(email, password, trimUsername);
      console.log('Registration success:', response);
      router.replace('/(tabs)/home');
    } catch(error: any) {
      console.error('Full registration error:', {
        message: error.config,
        response: error.response?.data,
        request: error.request,
        stack: error.stack
      });

      let message = 'Registration failed';
      if(error.message.includes('Network Error')) {
        message = 'Cannot connect to server. Check your network.';
      } else if(error.response?.data) {
        message = error.response.data.message;
      }
      Alert.alert('Error', message);
    }
  };

  

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#000' }}>
      <TextInput 
        placeholder="Email"
        placeholderTextColor='#999'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Password"
        placeholderTextColor='#999'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput 
        placeholder="Username"
        placeholderTextColor='#999'
        value={username}
        onChangeText={(text) => setUsername(text.replace(/\s/g, ''))} //remove all whitespace
        style={styles.input}
        autoCapitalize="none"
      />
      <Pressable
        onPress={handleRegister}
        disabled={state.isLoading}
        style={[styles.button, state.isLoading && styles.buttonDisabled]}
      >
        {state.isLoading ? (
          <ActivityIndicator color='#FFD700' />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <Link href='/login' asChild>
          <Pressable>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  input: {
    color: '#FFF',
    borderBottomColor: '#800080',
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#800080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#FFF',
    marginBottom: 5,
  },
  loginLink: {
    color: '#800080',
    fontWeight: 'bold',
  },
});