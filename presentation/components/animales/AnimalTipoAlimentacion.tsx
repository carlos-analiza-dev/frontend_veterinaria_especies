import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

interface Props {
  animal: Animal;
}

const AnimalTipoAlimentacion = ({ animal }: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={[styles.infoRow, { backgroundColor: colors.background }]}
    >
      <MaterialCommunityIcons
        name="silverware-clean"
        size={20}
        color={colors.onSurfaceVariant}
        style={styles.icon}
      />
      <View style={styles.chipsContainer}>
        {animal.tipo_alimentacion.map((alimento, index) => (
          <Chip
            key={`${alimento.alimento}-${index}`}
            style={[
              styles.smallChip,
              {
                backgroundColor: colors.secondaryContainer,
                marginRight: 4,
                marginBottom: 4,
              },
            ]}
            textStyle={{
              color: colors.onSecondaryContainer,
              fontSize: 12,
            }}
          >
            {alimento.alimento} {alimento.origen ? `(${alimento.origen})` : ""}
          </Chip>
        ))}
      </View>
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
  smallChip: {
    marginVertical: 2,
    height: 32,
    borderRadius: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    marginLeft: 8,
    gap: 4,
  },
  icon: {
    marginTop: 4,
  },
});

export default AnimalTipoAlimentacion;
