import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { Chip, Divider, useTheme } from "react-native-paper";

interface Raza {
  nombre: string;
}

interface Props {
  title: string;
  nombre?: string;
  arete?: string;
  razas?: Raza[];
  numeroParto?: number;
  esComprado?: boolean;
}

const AnimalParentInfo = ({
  title,
  nombre,
  arete,
  razas,
  numeroParto,
  esComprado,
}: Props) => {
  const { colors } = useTheme();

  if (!nombre && !arete && (!razas || razas.length === 0) && !numeroParto)
    return null;

  return (
    <>
      <Divider style={[styles.divider, { backgroundColor: colors.outline }]} />
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>

      {nombre && (
        <ThemedView
          style={[styles.infoRow, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons
            name="account"
            size={20}
            color={colors.onSurfaceVariant}
          />
          <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
            Nombre: {nombre}
          </ThemedText>
        </ThemedView>
      )}

      {arete && (
        <ThemedView
          style={[styles.infoRow, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons
            name="tag"
            size={20}
            color={colors.onSurfaceVariant}
          />
          <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
            Arete: {arete}
          </ThemedText>
        </ThemedView>
      )}

      {razas && (
        <ThemedView
          style={[styles.infoRow, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons
            name="gender-female"
            size={20}
            color={colors.onSurfaceVariant}
          />
          <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
            Raza:{" "}
            {razas.length === 1
              ? razas[0].nombre
              : razas.length > 1
              ? "Encaste"
              : "Sin raza"}
          </ThemedText>
        </ThemedView>
      )}

      {numeroParto !== undefined && (
        <ThemedView
          style={[styles.infoRow, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons
            name="counter"
            size={20}
            color={colors.onSurfaceVariant}
          />
          <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
            Número de parto: {numeroParto}
          </ThemedText>
        </ThemedView>
      )}

      {esComprado && (
        <Chip
          style={{
            backgroundColor: colors.secondaryContainer,
            marginVertical: 4,
          }}
          textStyle={{ color: colors.onSecondaryContainer }}
        >
          Comprado
        </Chip>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 8,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#333",
  },
});

export default AnimalParentInfo;
