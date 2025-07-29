import { Cultivo } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
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
  const { colors } = useTheme();

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
    <ThemedView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ThemedText style={styles.title}>
        <MaterialCommunityIcons name="sprout" size={20} /> Producción Agrícola
      </ThemedText>

      {agricola.cultivos.map((cultivo, index) => (
        <View key={`${agricola.id}-${index}`} style={styles.cultivoContainer}>
          <View style={styles.cultivoHeader}>
            <MaterialCommunityIcons
              name={getCultivoIcon(cultivo.tipo)}
              size={24}
              color={colors.primary}
            />
            <ThemedText style={[styles.cultivoTipo, { color: colors.primary }]}>
              {cultivo.tipo}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Estacionalidad:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {cultivo.estacionalidad}
            </ThemedText>
          </View>

          {cultivo.metodo_cultivo && (
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Método:</ThemedText>
              <ThemedText style={styles.detailValue}>
                {cultivo.metodo_cultivo}
              </ThemedText>
            </View>
          )}

          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Duración:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {cultivo.tiempo_estimado_cultivo}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Producción:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {cultivo.cantidad_producida_hectareas}
            </ThemedText>
          </View>

          <View style={styles.mesesContainer}>
            <ThemedText style={styles.detailLabel}>
              Meses de producción:
            </ThemedText>
            <View style={styles.mesesList}>
              {cultivo.meses_produccion.map((mes, i) => (
                <View
                  key={i}
                  style={[
                    styles.mesPill,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                >
                  <ThemedText style={{ color: colors.onPrimaryContainer }}>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flexDirection: "row",
    marginBottom: 16,
  },
  cultivoContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 16,
  },
  cultivoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cultivoTipo: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  detailLabel: {
    fontWeight: "500",
    color: "#666",
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
});

export default ProduccionAgricolaCard;
