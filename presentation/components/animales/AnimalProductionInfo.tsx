import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";

import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  produccion?: string | null;
  tipoProduccion?: string | null;
  animalMuerto: boolean;
  razonMuerte?: string | null;
}

const AnimalProductionInfo: React.FC<Props> = ({
  produccion,
  tipoProduccion,
  animalMuerto,
  razonMuerte,
}) => {
  const { colors } = useTheme();

  const getProductionIcon = () => {
    if (!produccion) return "help-circle-outline";
    switch (produccion.toLowerCase()) {
      case "engorde":
        return "trending-up-outline";
      case "leche":
        return "water-outline";
      case "reproducción":
        return "git-branch-outline";
      default:
        return "cube-outline";
    }
  };

  const getProductionColor = () => {
    if (animalMuerto) return colors.error;
    if (!produccion) return colors.backdrop;
    switch (produccion.toLowerCase()) {
      case "engorde":
        return colors.primary;
      case "leche":
        return colors.onSurface;
      case "reproducción":
        return colors.onTertiary;
      default:
        return colors.background;
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={[styles.row, { backgroundColor: colors.background }]}>
        <MyIcon
          name={getProductionIcon()}
          size={20}
          color={getProductionColor()}
          style={styles.icon}
        />
        <ThemedView
          style={[styles.textContainer, { backgroundColor: colors.background }]}
        >
          {produccion ? (
            <ThemedText style={[styles.text, { color: getProductionColor() }]}>
              {produccion}
              {tipoProduccion && ` (${tipoProduccion})`}
            </ThemedText>
          ) : (
            <ThemedText style={[styles.text, { color: colors.backdrop }]}>
              Sin producción definida
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      {animalMuerto && (
        <ThemedView
          style={[
            styles.row,
            { marginTop: 8, backgroundColor: colors.background },
          ]}
        >
          <MyIcon
            name="skull-outline"
            size={20}
            color={colors.error}
            style={styles.icon}
          />
          <ThemedView
            style={[
              styles.textContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <ThemedText style={[styles.text, { color: colors.error }]}>
              {razonMuerte && razonMuerte !== "N/D"
                ? `Muerto - ${razonMuerte}`
                : "Muerto"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
  productionContainer: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  productionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  productionIcon: {
    marginRight: 8,
  },
  deathBadge: {
    padding: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
});

export default AnimalProductionInfo;
