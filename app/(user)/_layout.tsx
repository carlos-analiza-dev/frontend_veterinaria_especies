import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Stack } from "expo-router";

import { Redirect } from "expo-router";

export default function UserLayout() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Mi App",
        headerRight: () => <LogoutIconButton />,
      }}
    >
      <Stack.Screen name="home" options={{ title: "Inicio" }} />
      <Stack.Screen
        name="profile"
        options={{
          title: "Perfil",
          headerBackTitle: "Atrás",
        }}
      />
    </Stack>
  );
}
