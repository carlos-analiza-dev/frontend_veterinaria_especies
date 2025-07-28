import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
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

  if (!ganadera) return null;

  return (
    <ThemedView style={[styles.card]}>
      <ThemedView style={{ backgroundColor: theme.colors.background }}>
        <ThemedText style={styles.title}>
          <MaterialCommunityIcons name="cow" size={20} /> Producción Ganadera
        </ThemedText>

        {/* Tipos de producción */}
        <View style={styles.chipContainer}>
          {ganadera.tiposProduccion.map((tipo, index) => (
            <Chip
              key={index}
              icon={getIconForProductionType(tipo)}
              style={styles.productionTypeChip}
            >
              {tipo}
            </Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        {/* Información general del hato */}
        <ThemedText style={styles.subtitle}>Hato Ganadero</ThemedText>
        <View style={styles.row}>
          <Text style={styles.label}>Vacas en ordeño:</Text>
          <Text>{ganadera.vacasOrdeño}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vacas secas:</Text>
          <Text>{ganadera.vacasSecas}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Terneros:</Text>
          <Text>{ganadera.terneros}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fecha promedio de secado:</Text>
          <Text>
            {new Date(ganadera.fechaPromedioSecado).toLocaleDateString()}
          </Text>
        </View>

        {/* Producción de leche */}
        {ganadera.tiposProduccion.includes("Leche") && (
          <>
            <Divider style={styles.divider} />
            <ThemedText style={styles.subtitle}>Producción Lechera</ThemedText>
            <View style={styles.row}>
              <Text style={styles.label}>Producción de leche:</Text>
              <Text>
                {ganadera.produccionLecheCantidad}{" "}
                {ganadera.produccionLecheUnidad}
              </Text>
            </View>
          </>
        )}

        {/* Producción de carne */}
        {ganadera.tiposProduccion.includes("Carne Bovina") && (
          <>
            <Divider style={styles.divider} />
            <ThemedText style={styles.subtitle}>Producción de Carne</ThemedText>
            <View style={styles.row}>
              <Text style={styles.label}>Cabezas en engorde:</Text>
              <Text>{ganadera.cabezasEngordeBovino}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Peso promedio al sacrificio:</Text>
              <Text>{ganadera.kilosSacrificioBovino} kg</Text>
            </View>
          </>
        )}

        {/* Otros productos */}
        {ganadera.otroProductoNombre && (
          <>
            <Divider style={styles.divider} />
            <ThemedText style={styles.subtitle}>Otros Productos</ThemedText>
            <View style={styles.row}>
              <Text style={styles.label}>{ganadera.otroProductoNombre}:</Text>
              <Text>
                {ganadera.otroProductoProduccionMensual}{" "}
                {ganadera.otroProductoUnidadMedida}
              </Text>
            </View>
          </>
        )}

        {/* Información de la finca */}
        <Divider style={styles.divider} />
        <ThemedText style={styles.subtitle}>Información de la Finca</ThemedText>
        <View style={styles.row}>
          <Text style={styles.label}>Área ganadera:</Text>
          <Text>{finca.area_ganaderia_hectarea} ha</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total animales:</Text>
          <Text>{finca.cantidad_animales}</Text>
        </View>

        {/* Especies manejadas */}
        {finca.especies_maneja.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Especies manejadas:</Text>
            <View style={styles.chipContainer}>
              {finca.especies_maneja.map((especie, index) => (
                <Chip key={index} style={styles.speciesChip}>
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

// Función auxiliar para obtener iconos según el tipo de producción
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
      return "cow";
  }
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
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
    color: "#555",
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#ddd",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 6,
  },
  productionTypeChip: {
    backgroundColor: "#E3F2FD",
  },
  speciesChip: {
    backgroundColor: "#E8F5E9",
    marginRight: 4,
    marginBottom: 4,
  },
  section: {
    marginTop: 8,
  },
});

export default ProduccionGanaderaCard;
