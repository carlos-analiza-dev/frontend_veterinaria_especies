import { Alternativa } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionAlternativaCardProps {
  alternativa: Alternativa;
}

const ProduccionAlternativaCard: React.FC<ProduccionAlternativaCardProps> = ({
  alternativa,
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
      marginBottom: isSmallScreen ? 10 : 12,
    },
    actividadTipo: {
      fontSize: isSmallScreen ? 14 : 16,
    },
    textSize: isSmallScreen ? 12 : 14,
    iconSize: isSmallScreen ? 16 : 20,
    detailMargin: isSmallScreen ? 4 : 6,
    dividerMargin: isSmallScreen ? 8 : 12,
    detailsMargin: Platform.select({
      ios: isSmallScreen ? 6 : 8,
      android: isSmallScreen ? 4 : 6,
      default: 8,
    }),
  };

  return (
    <View
      style={[
        styles.container,
        dynamicStyles.container,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <ThemedText style={[styles.title, dynamicStyles.title]}>
        <MaterialCommunityIcons
          name="swap-horizontal"
          size={dynamicStyles.iconSize}
        />{" "}
        Actividades Alternativas
      </ThemedText>

      {alternativa.actividades.map((actividad, index) => (
        <View key={index} style={styles.actividadContainer}>
          <View style={styles.actividadHeader}>
            <ThemedText
              style={[styles.actividadTipo, dynamicStyles.actividadTipo]}
            >
              {actividad.tipo}
            </ThemedText>
          </View>

          <View
            style={[
              styles.detailsContainer,
              { marginLeft: dynamicStyles.detailsMargin },
            ]}
          >
            <View
              style={[
                styles.detailRow,
                { marginBottom: dynamicStyles.detailMargin },
              ]}
            >
              <ThemedText
                style={[
                  styles.detailLabel,
                  { fontSize: dynamicStyles.textSize },
                ]}
              >
                Cantidad producida:
              </ThemedText>
              <ThemedText style={{ fontSize: dynamicStyles.textSize }}>
                {actividad.cantidad_producida} {actividad.unidad_medida || ""}
              </ThemedText>
            </View>

            <View
              style={[
                styles.detailRow,
                { marginBottom: dynamicStyles.detailMargin },
              ]}
            >
              <ThemedText
                style={[
                  styles.detailLabel,
                  { fontSize: dynamicStyles.textSize },
                ]}
              >
                Ingresos anuales:
              </ThemedText>
              <ThemedText style={{ fontSize: dynamicStyles.textSize }}>
                L {actividad.ingresos_anuales.toLocaleString()}
              </ThemedText>
            </View>

            {actividad.descripcion && (
              <View
                style={[
                  styles.detailRow,
                  { marginBottom: dynamicStyles.detailMargin },
                ]}
              >
                <ThemedText
                  style={[
                    styles.detailLabel,
                    { fontSize: dynamicStyles.textSize },
                  ]}
                >
                  Descripción:
                </ThemedText>
                <ThemedText
                  style={[
                    styles.descripcion,
                    { fontSize: dynamicStyles.textSize },
                  ]}
                >
                  {actividad.descripcion}
                </ThemedText>
              </View>
            )}
          </View>

          {index < alternativa.actividades.length - 1 && (
            <Divider
              style={[
                styles.divider,
                { marginVertical: dynamicStyles.dividerMargin },
              ]}
            />
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
  actividadContainer: {
    marginBottom: 12,
  },
  actividadHeader: {
    marginBottom: 8,
  },
  actividadTipo: {
    fontWeight: "bold",
  },
  detailsContainer: {},
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  descripcion: {
    flexShrink: 1,
    textAlign: "right",
    flex: 1,
    flexWrap: "wrap",
  },
  divider: {
    backgroundColor: "#D7CCC8",
    height: 1,
  },
});

export default ProduccionAlternativaCard;
