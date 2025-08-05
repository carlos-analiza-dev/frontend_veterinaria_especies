import { Cultivo } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface ProduccionAgricolaProps {
  agricola: {
    id: string;
    cultivos: Cultivo[];
  };
}

export const ProduccionAgricolaCard: React.FC<ProduccionAgricolaProps> = ({
  agricola,
}) => {
  const primary = useThemeColor({}, "primary");
  const { colors } = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    container: {
      marginVertical: isSmallScreen ? 6 : 8,
    },
    title: {
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
      marginBottom: isSmallScreen ? 12 : 16,
    },
    cultivoTipo: {
      fontSize: isSmallScreen ? 14 : 16,
    },
    detailText: {
      fontSize: isSmallScreen ? 12 : 14,
    },
    iconSize: isSmallScreen ? 18 : 24,
    pillPadding: isSmallScreen ? 8 : 12,
    pillMargin: isSmallScreen ? 4 : 8,
    rowMargin: isSmallScreen ? 2 : 4,
  };

  const getCultivoIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "maíz":
        return "corn";
      case "frijol":
        return "seed";
      default:
        return "sprout";
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        dynamicStyles.container,
        { backgroundColor: colors.surface },
      ]}
    >
      <ThemedText style={[styles.title, dynamicStyles.title]}>
        <MaterialCommunityIcons name="sprout" size={dynamicStyles.iconSize} />{" "}
        Producción Agrícola
      </ThemedText>

      {agricola.cultivos.map((cultivo, index) => (
        <View
          key={`${agricola.id}-${index}`}
          style={[
            styles.cultivoContainer,
            {
              borderBottomColor: colors.outline,
              paddingBottom: isSmallScreen ? 12 : 16,
            },
          ]}
        >
          <View style={styles.cultivoHeader}>
            <MaterialCommunityIcons
              name={getCultivoIcon(cultivo.tipo)}
              size={dynamicStyles.iconSize}
              color={primary}
            />
            <ThemedText
              style={[
                styles.cultivoTipo,
                dynamicStyles.cultivoTipo,
                { color: primary },
              ]}
            >
              {cultivo.tipo}
            </ThemedText>
          </View>

          <View
            style={[
              styles.detailRow,
              { marginVertical: dynamicStyles.rowMargin },
            ]}
          >
            <ThemedText style={[styles.detailLabel, dynamicStyles.detailText]}>
              Estacionalidad:
            </ThemedText>
            <ThemedText style={[styles.detailValue, dynamicStyles.detailText]}>
              {cultivo.estacionalidad}
            </ThemedText>
          </View>

          {cultivo.metodo_cultivo && (
            <View
              style={[
                styles.detailRow,
                { marginVertical: dynamicStyles.rowMargin },
              ]}
            >
              <ThemedText
                style={[styles.detailLabel, dynamicStyles.detailText]}
              >
                Método:
              </ThemedText>
              <ThemedText
                style={[styles.detailValue, dynamicStyles.detailText]}
              >
                {cultivo.metodo_cultivo}
              </ThemedText>
            </View>
          )}

          <View
            style={[
              styles.detailRow,
              { marginVertical: dynamicStyles.rowMargin },
            ]}
          >
            <ThemedText style={[styles.detailLabel, dynamicStyles.detailText]}>
              Duración:
            </ThemedText>
            <ThemedText style={[styles.detailValue, dynamicStyles.detailText]}>
              {cultivo.tiempo_estimado_cultivo}
            </ThemedText>
          </View>

          <View
            style={[
              styles.detailRow,
              { marginVertical: dynamicStyles.rowMargin },
            ]}
          >
            <ThemedText style={[styles.detailLabel, dynamicStyles.detailText]}>
              Producción:
            </ThemedText>
            <ThemedText style={[styles.detailValue, dynamicStyles.detailText]}>
              {cultivo.cantidad_producida_hectareas}
            </ThemedText>
          </View>

          <View style={styles.mesesContainer}>
            <ThemedText style={[styles.detailLabel, dynamicStyles.detailText]}>
              Meses de producción:
            </ThemedText>
            <View style={styles.mesesList}>
              {cultivo.meses_produccion.map((mes, i) => (
                <View
                  key={i}
                  style={[
                    styles.mesPill,
                    {
                      backgroundColor: colors.primaryContainer,
                      paddingHorizontal: dynamicStyles.pillPadding,
                      marginRight: dynamicStyles.pillMargin,
                      marginBottom: dynamicStyles.pillMargin,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      color: colors.onPrimaryContainer,
                      fontSize: dynamicStyles.detailText.fontSize,
                    }}
                  >
                    {mes}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 8,
    padding: Platform.select({
      ios: 12,
      android: 10,
      default: 12,
    }),
  },
  title: {
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  cultivoContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  cultivoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cultivoTipo: {
    fontWeight: "600",
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontWeight: "bold",
  },
  detailValue: {
    fontWeight: "400",
  },
  mesesContainer: {
    marginTop: 8,
  },
  mesesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  mesPill: {
    borderRadius: 16,
    paddingVertical: 4,
  },
});

export default ProduccionAgricolaCard;
