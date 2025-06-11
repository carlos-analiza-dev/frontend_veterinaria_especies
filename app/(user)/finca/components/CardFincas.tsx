import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, useTheme } from "react-native-paper";

interface Props {
  finca: Finca;
  onPress: () => void;
}

const CardFincas = ({ finca, onPress }: Props) => {
  const { colors } = useTheme();

  type AllowedIcons = "cow" | "horse" | "pig" | "bird" | "sheep" | "paw";

  const getSpeciesIcon = (especie: string): AllowedIcons => {
    switch (especie.toLowerCase()) {
      case "bovina":
        return "cow";
      case "equina":
        return "horse";
      case "porcina":
        return "pig";
      case "aves":
        return "bird";
      case "caprinos":
        return "sheep";
      default:
        return "paw";
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="home-assistant"
              size={30}
              color={colors.onSurfaceVariant}
            />
            <ThemedText style={styles.fincaName}>
              {finca.nombre_finca} ({finca.abreviatura})
            </ThemedText>
          </View>

          <Divider style={styles.divider} />
          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="cow"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <ThemedText style={styles.infoText}>
              {finca.cantidad_animales} animales
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <ThemedText style={styles.infoText}>
              {finca.municipio.nombre}, {finca.departamento.nombre}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="texture-box"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <ThemedText style={styles.infoText}>
              {finca.tamaño_total} - {finca.area_ganaderia} para ganadería
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="account-cowboy-hat"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <ThemedText style={styles.infoText}>
              {finca.tipo_explotacion}
            </ThemedText>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="paw"
              size={20}
              color={colors.onSurfaceVariant}
            />
            <View style={styles.speciesContainer}>
              <ThemedText style={styles.infoText}>Especies:</ThemedText>
              <View style={styles.speciesList}>
                {finca.especies_maneja.map(({ especie, cantidad }, index) => (
                  <View key={index} style={styles.speciesItem}>
                    <MaterialCommunityIcons
                      name={getSpeciesIcon(especie)}
                      size={16}
                      color={colors.onSurfaceVariant}
                      style={styles.speciesIcon}
                    />
                    <ThemedText style={styles.speciesText}>
                      {especie} - {cantidad}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CardFincas;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fincaName: {
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
  noFincasText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  speciesContainer: {
    flex: 1,
    marginLeft: 8,
  },
  speciesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  speciesItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  speciesIcon: {
    marginRight: 4,
  },
  speciesText: {
    fontSize: 14,
  },
});
