import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import Profile from "@/presentation/components/Profile";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { ScrollView, useWindowDimensions } from "react-native";

const PerfilAdminPage = () => {
  const { user } = useAuthStore();
  const primary = useThemeColor({}, "tint");

  const { height } = useWindowDimensions();

  return (
    <ScrollView style={{ flex: 1 }}>
      <Profile user={user} primary={primary} height={height} />
    </ScrollView>
  );
};

export default PerfilAdminPage;
