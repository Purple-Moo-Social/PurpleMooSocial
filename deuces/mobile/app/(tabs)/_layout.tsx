// deuces\mobile\app\(tabs)\_layout.tsx
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { state } = useAuth();

  if(!state.isLoading && !state.isAuthenticated) {
    return <Redirect href='/(auth)/login'/>;
  }

  return (
      <Tabs
        screenOptions={{
          lazy: true,
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#555',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#800020',
          },
          headerShown: false
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name='home' size={24} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name='person' size={24} color={color} />
            ),
          }}
        /> */}
      </Tabs>
  );
}