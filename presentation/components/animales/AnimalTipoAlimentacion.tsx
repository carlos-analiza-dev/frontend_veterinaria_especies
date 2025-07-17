import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

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
        {animal.tipo_alimentacion.map((alimento, index) => {
          let label = `${alimento.alimento}`;
          if (alimento.origen === "comprado y producido") {
            label += ` (${alimento.origen} - ${alimento.porcentaje_comprado}% comprado, ${alimento.porcentaje_producido}% producido)`;
          } else if (alimento.origen) {
            label += ` (${alimento.origen})`;
          }

          return (
            <View
              key={`${alimento.alimento}-${index}`}
              style={[
                styles.customChip,
                {
                  backgroundColor: colors.secondaryContainer,
                },
              ]}
            >
              <ThemedText
                style={{
                  color: colors.onSecondaryContainer,
                  fontSize: 12,
                }}
              >
                {alimento.alimento}
              </ThemedText>
              <ThemedText
                style={{
                  color: colors.onSecondaryContainer,
                  fontSize: 11,
                }}
              >
                {alimento.origen === "comprado y producido"
                  ? `(${alimento.origen} - ${alimento.porcentaje_comprado}% comprado, ${alimento.porcentaje_producido}% producido)`
                  : alimento.origen
                  ? `(${alimento.origen})`
                  : ""}
              </ThemedText>
            </View>
          );
        })}
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
  customChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 4,
    marginBottom: 4,
    maxWidth: "100%",
  },
});

export default AnimalTipoAlimentacion;
