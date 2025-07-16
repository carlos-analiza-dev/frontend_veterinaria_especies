import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

interface Props {
  sexo: "Macho" | "Hembra";
  valor: boolean | undefined;
}

const ReproductiveStatus = ({ sexo, valor }: Props) => {
  const { colors } = useTheme();

  const label = sexo === "Macho" ? "Castrado" : "Esterilizado";
  const texto = valor === true ? "Si" : "No";

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedText>{label}:</ThemedText>
      <View style={styles.chipWrapper}>
        <Chip
          style={[styles.chip, { backgroundColor: colors.secondaryContainer }]}
          textStyle={{ color: colors.onSecondaryContainer }}
        >
          {texto}
        </Chip>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  chipWrapper: {
    marginLeft: 8,
  },
  chip: {
    height: 32,
    borderRadius: 16,
  },
});

export default ReproductiveStatus;
