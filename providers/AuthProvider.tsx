import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { status, checkStatus } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" />
  </View>
);
