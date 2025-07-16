import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  fincaNombre: string;
  fincaAbreviatura: string;
  propietarioNombre: string;
  observaciones?: string | null;
}

const AnimalFincaByPropietarion = ({
  fincaNombre,
  fincaAbreviatura,
  propietarioNombre,
  observaciones,
}: Props) => {
  const { colors } = useTheme();

  return (
    <>
      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="home"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Finca: {fincaNombre} ({fincaAbreviatura})
        </ThemedText>
      </ThemedView>

      <ThemedView
        style={[styles.infoRow, { backgroundColor: colors.background }]}
      >
        <MaterialCommunityIcons
          name="account"
          size={20}
          color={colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
          Propietario: {propietarioNombre}
        </ThemedText>
      </ThemedView>

      {observaciones && (
        <ThemedView
          style={[styles.infoColumn, { backgroundColor: colors.background }]}
        >
          <MaterialCommunityIcons
            name="note-text"
            size={20}
            color={colors.onSurfaceVariant}
          />
          <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
            Características: {observaciones}
          </ThemedText>
        </ThemedView>
      )}
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
  infoColumn: {
    flexDirection: "column",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
});

export default AnimalFincaByPropietarion;
