import { ForrajesInsumo } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionForrajesCardProps {
  forrajesInsumo: ForrajesInsumo;
}

const ProduccionForrajesCard: React.FC<ProduccionForrajesCardProps> = ({
  forrajesInsumo,
}) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    container: {
      borderRadius: isSmallScreen ? 6 : 8,
      marginBottom: isSmallScreen ? 6 : 8,
      padding: isSmallScreen ? 10 : 12,
    },
    title: {
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
      marginBottom: isSmallScreen ? 8 : 12,
    },
    insumoTipo: {
      fontSize: isSmallScreen ? 14 : 16,
    },
    detailText: {
      fontSize: isSmallScreen ? 12 : 14,
    },
    iconSize: isSmallScreen ? 16 : 20,
    divider: {
      marginVertical: isSmallScreen ? 8 : 12,
    },
    detailRow: {
      marginBottom: isSmallScreen ? 4 : 6,
    },
  };

  return (
    <View
      style={[
        styles.container,
        dynamicStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ThemedText style={[styles.title, dynamicStyles.title]}>
        <MaterialCommunityIcons name="grass" size={dynamicStyles.iconSize} />
        Forrajes e Insumos
      </ThemedText>

      {forrajesInsumo.insumos.map((insumo, index) => (
        <View key={index}>
          <View style={styles.insumoHeader}>
            <ThemedText style={[styles.insumoTipo, dynamicStyles.insumoTipo]}>
              {insumo.tipo}
            </ThemedText>
          </View>

          {insumo.tipo === "Heno" && (
            <View style={styles.detailsContainer}>
              <View style={[styles.detailRow, dynamicStyles.detailRow]}>
                <ThemedText
                  style={[styles.detailLabel, dynamicStyles.detailText]}
                >
                  Tipo de heno:
                </ThemedText>
                <ThemedText style={dynamicStyles.detailText}>
                  {insumo.tipo_heno}
                </ThemedText>
              </View>
              <View style={[styles.detailRow, dynamicStyles.detailRow]}>
                <ThemedText
                  style={[styles.detailLabel, dynamicStyles.detailText]}
                >
                  Estacionalidad:
                </ThemedText>
                <ThemedText style={dynamicStyles.detailText}>
                  {insumo.estacionalidad_heno}
                </ThemedText>
              </View>
              <View style={[styles.detailRow, dynamicStyles.detailRow]}>
                <ThemedText
                  style={[styles.detailLabel, dynamicStyles.detailText]}
                >
                  Meses producción:
                </ThemedText>
                <ThemedText style={dynamicStyles.detailText}>
                  {insumo.meses_produccion_heno?.join(", ")}
                </ThemedText>
              </View>
            </View>
          )}

          {insumo.tipo === "Silo" && (
            <View style={styles.detailsContainer}>
              <View style={[styles.detailRow, dynamicStyles.detailRow]}>
                <ThemedText
                  style={[styles.detailLabel, dynamicStyles.detailText]}
                >
                  Producción por manzana:
                </ThemedText>
                <ThemedText style={dynamicStyles.detailText}>
                  {insumo.produccion_manzana}
                </ThemedText>
              </View>
              <View style={[styles.detailRow, dynamicStyles.detailRow]}>
                <ThemedText
                  style={[styles.detailLabel, dynamicStyles.detailText]}
                >
                  Tiempo estimado:
                </ThemedText>
                <ThemedText style={dynamicStyles.detailText}>
                  {insumo.tiempo_estimado_cultivo}
                </ThemedText>
              </View>
            </View>
          )}

          {index < forrajesInsumo.insumos.length - 1 && (
            <Divider style={[styles.divider, dynamicStyles.divider]} />
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
    padding: 12,
  },
  title: {
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  insumoHeader: {
    marginBottom: 8,
  },
  insumoTipo: {
    fontWeight: "600",
    color: "#2E7D32",
  },
  detailsContainer: {
    marginLeft: Platform.select({
      ios: 8,
      android: 6,
      default: 8,
    }),
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  divider: {
    backgroundColor: "#e0e0e0",
  },
});

export default ProduccionForrajesCard;
