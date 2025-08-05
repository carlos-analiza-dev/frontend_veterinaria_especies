import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionApiculturaCardProps {
  apicultura: ObtenerProduccionByUserInterface["apicultura"];
}

const ProduccionApiculturaCard: React.FC<ProduccionApiculturaCardProps> = ({
  apicultura,
}) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    sectionTitle: {
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
      marginBottom: isSmallScreen ? 12 : 16,
    },
    textSize: isSmallScreen ? 13 : 14,
    iconSize: isSmallScreen ? 16 : 20,
    rowMargin: isSmallScreen ? 4 : 6,
    containerPadding: Platform.select({
      ios: isSmallScreen ? 10 : 12,
      android: isSmallScreen ? 8 : 10,
      default: 12,
    }),
  };

  if (!apicultura) return null;

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          padding: dynamicStyles.containerPadding,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
        <MaterialCommunityIcons name="bee" size={dynamicStyles.iconSize} />{" "}
        Apicultura
      </ThemedText>

      <View style={[styles.row, { marginBottom: dynamicStyles.rowMargin }]}>
        <Text style={[styles.label, { fontSize: dynamicStyles.textSize }]}>
          Número de colmenas:
        </Text>
        <Text style={{ fontSize: dynamicStyles.textSize }}>
          {apicultura.numero_colmenas}
        </Text>
      </View>

      <View style={[styles.row, { marginBottom: dynamicStyles.rowMargin }]}>
        <Text style={[styles.label, { fontSize: dynamicStyles.textSize }]}>
          Frecuencia de cosecha:
        </Text>
        <Text style={{ fontSize: dynamicStyles.textSize }}>
          {apicultura.frecuencia_cosecha}
        </Text>
      </View>

      <View style={[styles.row, { marginBottom: dynamicStyles.rowMargin }]}>
        <Text style={[styles.label, { fontSize: dynamicStyles.textSize }]}>
          Producción por cosecha:
        </Text>
        <Text style={{ fontSize: dynamicStyles.textSize }}>
          {apicultura.cantidad_por_cosecha} kg
        </Text>
      </View>

      <View style={[styles.row, { marginBottom: dynamicStyles.rowMargin }]}>
        <Text style={[styles.label, { fontSize: dynamicStyles.textSize }]}>
          Calidad de miel:
        </Text>
        <Text style={{ fontSize: dynamicStyles.textSize }}>
          {apicultura.calidad_miel}
        </Text>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  divider: {
    marginVertical: 12,
  },
});

export default ProduccionApiculturaCard;
