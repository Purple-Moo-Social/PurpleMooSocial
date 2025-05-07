//C:\Users\envas\PurpleMooSocial\deuces\mobile\app\(tabs)\_layout.tsx
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { state } = useAuth();

  if(!state.isAuthenticated) {
    return <Redirect href='/login' />;
  }

  return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFD700',
          tabBarInactiveTintColor: '#555',
          tabBarStyle: {
            backgroundColor: '#000',
            borderTopColor: '#800020',
          }
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
        <Tabs.Screen 
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name='person' size={24} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}