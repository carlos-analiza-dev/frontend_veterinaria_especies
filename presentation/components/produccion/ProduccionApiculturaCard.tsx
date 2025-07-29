import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionApiculturaCardProps {
  apicultura: ObtenerProduccionByUserInterface["apicultura"];
}

const ProduccionApiculturaCard: React.FC<ProduccionApiculturaCardProps> = ({
  apicultura,
}) => {
  const theme = useTheme();

  if (!apicultura) return null;

  return (
    <ThemedView style={{ backgroundColor: theme.colors.background }}>
      <ThemedText style={styles.sectionTitle}>
        <MaterialCommunityIcons name="bee" size={20} />
        Apicultura
      </ThemedText>

      <View style={styles.row}>
        <Text style={styles.label}>Número de colmenas:</Text>
        <Text>{apicultura.numero_colmenas}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Frecuencia de cosecha:</Text>
        <Text>{apicultura.frecuencia_cosecha}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Producción por cosecha:</Text>
        <Text>{apicultura.cantidad_por_cosecha} kg</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Calidad de miel:</Text>
        <Text>{apicultura.calidad_miel}</Text>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    marginBottom: 16,
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
    marginVertical: 12,
  },
});

export default ProduccionApiculturaCard;
