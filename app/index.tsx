// app/index.tsx
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { status, checkStatus, user } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/login" />;
  }

  if (user?.role.name === "Administrador") {
    return <Redirect href="/(admin)/users" />;
  }

  if (user?.role.name === "Secretario") {
    return <Redirect href="/(secretario)/home" />;
  }

  if (user?.role.name === "Veterinario") {
    return (
      <Redirect href="/(veterinario)/citas-veterinario/citas-pendientes" />
    );
  }

  return <Redirect href="/(user)/citas/home" />;
}
