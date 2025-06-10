import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Divider, useTheme } from "react-native-paper";

interface Props {
  finca: Finca;
}

const CardFincas = ({ finca }: Props) => {
  const { colors } = useTheme();
  return (
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
      </Card.Content>
    </Card>
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
    alignItems: "center",
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
});
