import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

interface Props {
  animal: Animal;
}

const AnimalComplementos = ({ animal }: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={[styles.infoRow, { backgroundColor: colors.background }]}
    >
      <MaterialCommunityIcons
        name="abacus"
        size={20}
        color={colors.onSurfaceVariant}
        style={styles.icon}
      />
      <View style={styles.chipsContainer}>
        {animal?.complementos?.map((complemento, index) => (
          <Chip
            key={`${complemento.complemento}-${index}`}
            style={[
              styles.smallChip,
              {
                backgroundColor: colors.tertiaryContainer,
                marginRight: 4,
                marginBottom: 4,
              },
            ]}
            textStyle={{
              color: colors.onTertiaryContainer,
              fontSize: 12,
            }}
          >
            {complemento.complemento}
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

export default AnimalComplementos;
