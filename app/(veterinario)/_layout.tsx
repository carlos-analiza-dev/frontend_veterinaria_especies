import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Stack } from "expo-router";

import { Redirect } from "expo-router";

export default function VeterinarioLayout() {
  const { user } = useAuthStore();

  if (user?.role.name !== "Veterinario") {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Panel Veterinario",
        headerRight: () => <LogoutIconButton />,
      }}
    >
      <Stack.Screen name="home" options={{ title: "Inicio Veterinario" }} />
    </Stack>
  );
}
