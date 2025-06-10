import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useTheme } from "react-native-paper";

const HomeUser = () => {
  const { colors } = useTheme();
  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView style={{ marginTop: 8, justifyContent: "center" }}>
        <ThemedText type="subtitle">Agendar Cita</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

export default HomeUser;
