//C:\Users\envas\PurpleMooSocial\deuces\mobile\components\ProtectedRoute.tsx
import { Redirect } from "expo-router";
import { ActivityIndicator, View, Text } from "react-native";
import { useAuth } from "../app/context/AuthContext";


interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { state } = useAuth();

  if(state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        <ActivityIndicator size='large' color='#FFD700' />
        <Text style={{ marginTop: 10, color: '#800020' }} >Checking authentication...</Text>
      </View>
    );
  }

  if(!state.isAuthenticated) {
    return <Redirect href={{ pathname: "../login" }} />;
  }

  return children;
}