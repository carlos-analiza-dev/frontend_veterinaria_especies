import { ForrajesInsumo } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionForrajesCardProps {
  forrajesInsumo: ForrajesInsumo;
}

const ProduccionForrajesCard: React.FC<ProduccionForrajesCardProps> = ({
  forrajesInsumo,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ThemedText style={styles.title}>
        <MaterialCommunityIcons name="grass" size={20} />
        Forrajes e Insumos
      </ThemedText>

      {forrajesInsumo.insumos.map((insumo, index) => (
        <View key={index}>
          <View style={styles.insumoHeader}>
            <ThemedText style={styles.insumoTipo}>{insumo.tipo}</ThemedText>
          </View>

          {insumo.tipo === "Heno" && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Tipo de heno:
                </ThemedText>
                <ThemedText>{insumo.tipo_heno}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Estacionalidad:
                </ThemedText>
                <ThemedText>{insumo.estacionalidad_heno}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Meses producción:
                </ThemedText>
                <ThemedText>
                  {insumo.meses_produccion_heno?.join(", ")}
                </ThemedText>
              </View>
            </View>
          )}

          {insumo.tipo === "Silo" && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Producción por manzana:
                </ThemedText>
                <ThemedText>{insumo.produccion_manzana}</ThemedText>
              </View>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>
                  Tiempo estimado:
                </ThemedText>
                <ThemedText>{insumo.tiempo_estimado_cultivo}</ThemedText>
              </View>
            </View>
          )}

          {index < forrajesInsumo.insumos.length - 1 && (
            <Divider style={styles.divider} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  insumoHeader: {
    marginBottom: 8,
  },
  insumoTipo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  detailsContainer: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  divider: {
    marginVertical: 12,
  },
});

export default ProduccionForrajesCard;
