//C:\Users\envas\PurpleMooSocial\deuces\mobile\components\LogoutButton.tsx
import { Pressable, Text } from "react-native";
import { useAuth } from "../app/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={{
        backgroundColor: '#800020',
        padding: 10,
        borderRadius: 5,
        margin: 10
      }}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>
        Logout
      </Text>
    </Pressable>
  );
}