import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  animal: Animal;
}

const AnimalMedicamento = ({ animal }: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={[styles.infoRow, { backgroundColor: colors.background }]}
    >
      <MaterialCommunityIcons
        name="medical-bag"
        size={20}
        color={colors.onSurfaceVariant}
        style={styles.icon}
      />
      <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
        Medicamento: {animal.medicamento}
      </ThemedText>
    </ThemedView>
  );
};
const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  icon: {
    marginTop: 4,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
});
export default AnimalMedicamento;
