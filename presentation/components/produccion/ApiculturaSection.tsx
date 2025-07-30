import { CreateProduccionFinca } from "@/core/produccion/interface/crear-produccion-finca.interface";
import { calidadesMiel } from "@/helpers/data/dataProduccionFinca";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

interface ApiculturaSectionProps {
  control: Control<CreateProduccionFinca>;
}

const ApiculturaSection: React.FC<ApiculturaSectionProps> = ({ control }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.primary }]}>
        Producción Apícola
      </Text>

      <View style={styles.card}>
        <Text style={styles.inputLabel}>Número de colmenas</Text>
        <Controller
          control={control}
          name="apicultura.numero_colmenas"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              placeholder="Ej: 25"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
              keyboardType="numeric"
              style={styles.input}
              icon="calculator-sharp"
            />
          )}
        />
        <Text style={styles.inputLabel}>Frecuencia de cosecha</Text>
        <Controller
          control={control}
          name="apicultura.frecuencia_cosecha"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ej: Cada 2 meses"
              style={styles.input}
              icon="calendar-outline"
            />
          )}
        />
        <Text style={styles.inputLabel}>Cantidad por cosecha (kg)</Text>
        <Controller
          control={control}
          name="apicultura.cantidad_por_cosecha"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
              keyboardType="decimal-pad"
              placeholder="Ej: 150.75"
              style={styles.input}
              icon="trending-up"
            />
          )}
        />
        <Text style={styles.inputLabel}>Calidad de la miel</Text>
        <Controller
          control={control}
          name="apicultura.calidad_miel"
          render={({ field: { value, onChange } }) => (
            <ThemedPicker
              items={calidadesMiel.map((calidad) => ({
                label: calidad,
                value: calidad,
              }))}
              selectedValue={value}
              onValueChange={onChange}
              placeholder="Seleccione la calidad"
              icon="flower-outline"
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
});

export default ApiculturaSection;
