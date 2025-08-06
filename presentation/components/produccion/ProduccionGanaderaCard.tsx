import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionGanaderaCardProps {
  ganadera: ObtenerProduccionByUserInterface["ganadera"];
  finca: ObtenerProduccionByUserInterface["finca"];
}

const ProduccionGanaderaCard: React.FC<ProduccionGanaderaCardProps> = ({
  ganadera,
  finca,
}) => {
  const theme = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    card: {
      margin: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
      marginBottom: isSmallScreen ? 8 : 12,
    },
    title: {
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
    },
    subtitle: {
      fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
    },
    text: {
      fontSize: isSmallScreen ? 12 : 14,
    },
    chipText: {
      fontSize: isSmallScreen ? 11 : 12,
    },
    divider: {
      marginVertical: isSmallScreen ? 8 : 10,
    },
    iconSize: isSmallScreen ? 16 : 20,
  };

  if (!ganadera) return null;

  return (
    <ThemedView style={[styles.card, dynamicStyles.card]}>
      <ThemedView style={{ backgroundColor: theme.colors.background }}>
        <ThemedText style={[styles.title, dynamicStyles.title]}>
          <MaterialCommunityIcons name="cow" size={dynamicStyles.iconSize} />{" "}
          Producción Ganadera
        </ThemedText>

        <View style={styles.chipContainer}>
          {ganadera.tiposProduccion.map((tipo, index) => (
            <Chip
              key={index}
              icon={getIconForProductionType(tipo)}
              style={styles.productionTypeChip}
              textStyle={dynamicStyles.chipText}
            >
              {tipo}
            </Chip>
          ))}
        </View>

        <Divider style={[styles.divider, dynamicStyles.divider]} />

        <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
          Hato Ganadero
        </ThemedText>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>
            Vacas en ordeño:
          </Text>
          <Text style={dynamicStyles.text}>{ganadera.vacasOrdeño}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>Vacas secas:</Text>
          <Text style={dynamicStyles.text}>{ganadera.vacasSecas}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>Terneros:</Text>
          <Text style={dynamicStyles.text}>{ganadera.terneros}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>
            Fecha promedio de secado:
          </Text>
          <Text style={dynamicStyles.text}>
            {new Date(ganadera.fechaPromedioSecado).toLocaleDateString()}
          </Text>
        </View>

        {ganadera.tiposProduccion.includes("Leche") && (
          <>
            <Divider style={[styles.divider, dynamicStyles.divider]} />
            <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
              Producción Lechera
            </ThemedText>
            <View style={styles.row}>
              <Text style={[styles.label, dynamicStyles.text]}>
                Producción de leche:
              </Text>
              <Text style={dynamicStyles.text}>
                {ganadera.produccionLecheCantidad}{" "}
                {ganadera.produccionLecheUnidad}
              </Text>
            </View>
          </>
        )}

        {ganadera.tiposProduccion.includes("Carne Bovina") && (
          <>
            <Divider style={[styles.divider, dynamicStyles.divider]} />
            <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
              Producción de Carne
            </ThemedText>
            <View style={styles.row}>
              <Text style={[styles.label, dynamicStyles.text]}>
                Cabezas en engorde:
              </Text>
              <Text style={dynamicStyles.text}>
                {ganadera.cabezasEngordeBovino}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, dynamicStyles.text]}>
                Peso promedio al sacrificio:
              </Text>
              <Text style={dynamicStyles.text}>
                {ganadera.kilosSacrificioBovino} kg
              </Text>
            </View>
          </>
        )}

        {ganadera.otroProductoNombre && (
          <>
            <Divider style={[styles.divider, dynamicStyles.divider]} />
            <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
              Otros Productos
            </ThemedText>
            <View style={styles.row}>
              <Text style={[styles.label, dynamicStyles.text]}>
                {ganadera.otroProductoNombre}:
              </Text>
              <Text style={dynamicStyles.text}>
                {ganadera.otroProductoProduccionMensual}{" "}
                {ganadera.otroProductoUnidadMedida}
              </Text>
            </View>
          </>
        )}

        <Divider style={[styles.divider, dynamicStyles.divider]} />
        <ThemedText style={[styles.subtitle, dynamicStyles.subtitle]}>
          Información de la Finca
        </ThemedText>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>Área ganadera:</Text>
          <Text style={dynamicStyles.text}>
            {finca.area_ganaderia_hectarea} ha
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.text]}>
            Total animales:
          </Text>
          <Text style={dynamicStyles.text}>{finca.cantidad_animales}</Text>
        </View>

        {finca.especies_maneja.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.label, dynamicStyles.text]}>
              Especies manejadas:
            </Text>
            <View style={styles.chipContainer}>
              {finca.especies_maneja.map((especie, index) => (
                <Chip
                  key={index}
                  style={styles.speciesChip}
                  textStyle={dynamicStyles.chipText}
                >
                  {especie.especie}: {especie.cantidad}
                </Chip>
              ))}
            </View>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
};

const getIconForProductionType = (type: string) => {
  switch (type) {
    case "Leche":
      return "cup-water";
    case "Carne Bovina":
      return "food-steak";
    case "Huevos":
      return "egg";
    case "Cerdo":
      return "pig";
    case "Caprino":
      return "goat";
    default:
      return "swap-horizontal";
  }
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#ddd",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: Platform.select({
      ios: 6,
      android: 4,
      default: 6,
    }),
  },
  productionTypeChip: {
    backgroundColor: "#E3F2FD",
  },
  speciesChip: {
    backgroundColor: "#E8F5E9",
    marginBottom: 4,
  },
  section: {
    marginTop: 8,
  },
});

export default ProduccionGanaderaCard;
