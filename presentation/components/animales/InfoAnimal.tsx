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

const InfoAnimal = ({ animal }: Props) => {
  const { colors } = useTheme();
  return (
    <>
      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="calendar"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Nacimiento:
          {new Date(animal.fecha_nacimiento).toLocaleDateString()}
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="calendar-clock"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Registro: {new Date(animal.fecha_registro).toLocaleDateString()}
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="palette"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Color: {animal.color}
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="clock"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Edad: {animal.edad_promedio} años
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="dna"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Pureza: {animal.pureza}
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="baby-buggy"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Reproducción: {animal.tipo_reproduccion}
        </ThemedText>
      </ThemedView>
    </>
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
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
});

export default InfoAnimal;
