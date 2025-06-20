import { FAB } from "@/presentation/components/FAB";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useTheme } from "react-native-paper";

const HomeUser = () => {
  const { colors } = useTheme();
  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedText type="subtitle">Agendar Cita</ThemedText>
      <FAB iconName="add-outline" onPress={() => {}} />
    </ThemedView>
  );
};

export default HomeUser;
