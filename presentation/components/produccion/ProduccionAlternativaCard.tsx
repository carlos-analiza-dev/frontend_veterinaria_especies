import { Alternativa } from "@/core/produccion/interface/obter-producciones-userId.interface";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";

interface ProduccionAlternativaCardProps {
  alternativa: Alternativa;
}

const ProduccionAlternativaCard: React.FC<ProduccionAlternativaCardProps> = ({
  alternativa,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <ThemedText style={styles.title}>
        <MaterialCommunityIcons name="swap-horizontal" size={20} /> Actividades
        Alternativas
      </ThemedText>

      {alternativa.actividades.map((actividad, index) => (
        <View key={index} style={styles.actividadContainer}>
          <View style={styles.actividadHeader}>
            <ThemedText style={styles.actividadTipo}>
              {actividad.tipo}
            </ThemedText>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>
                Cantidad producida:
              </ThemedText>
              <ThemedText>
                {actividad.cantidad_producida} {actividad.unidad_medida || ""}
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>
                Ingresos anuales:
              </ThemedText>
              <ThemedText>
                L {actividad.ingresos_anuales.toLocaleString()}
              </ThemedText>
            </View>

            {actividad.descripcion && (
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Descripción:</ThemedText>
                <ThemedText style={styles.descripcion}>
                  {actividad.descripcion}
                </ThemedText>
              </View>
            )}
          </View>

          {index < alternativa.actividades.length - 1 && (
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
  actividadContainer: {
    marginBottom: 12,
  },
  actividadHeader: {
    marginBottom: 8,
  },
  actividadTipo: {
    fontSize: 16,
    fontWeight: "600",
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
  descripcion: {
    flexShrink: 1,
    textAlign: "right",
  },
  divider: {
    marginVertical: 12,
    backgroundColor: "#D7CCC8",
  },
});

export default ProduccionAlternativaCard;
