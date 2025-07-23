import { Analisis } from "@/core/analisis_suelo/interface/response-analisis-suelo.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

interface Props {
  analisis: Analisis;
  handleEdit: (analisis: Analisis) => void;
}

const CardAnalisisSuelo = ({ analisis, handleEdit }: Props) => {
  const primary = useThemeColor({}, "primary");
  return (
    <ThemedView style={styles.card}>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Text style={styles.date}>
          Fecha análisis:{" "}
          {new Date(analisis.fechaAnalisis).toLocaleDateString()}
        </Text>
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => handleEdit(analisis)}
          iconColor={primary}
          style={styles.editButton}
        />
      </ThemedView>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Calidad:</Text>
        <Text style={styles.value}>{analisis.calidadSuelo}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{analisis.tipoSuelo}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Rendimiento:</Text>
        <Text style={styles.value}>{analisis.rendimiento} kg/ha</Text>
      </View>

      {analisis.phSuelo && (
        <View style={styles.infoRow}>
          <Text style={styles.label}>pH:</Text>
          <Text style={styles.value}>{analisis.phSuelo}</Text>
        </View>
      )}

      <View style={styles.infoRow}>
        <Text style={styles.label}>Eficiencia:</Text>
        <Text style={styles.value}>{analisis.eficienciaInsumos}%</Text>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  label: {
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  value: {
    color: "#374151",
    flex: 1,
    textAlign: "right",
  },
  editButton: {
    margin: 0,
    padding: 0,
  },
});

export default CardAnalisisSuelo;
