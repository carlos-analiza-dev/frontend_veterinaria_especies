import { CreateProduccionFinca } from "@/core/produccion/interface/crear-produccion-finca.interface";
import { calidadesMiel } from "@/helpers/data/dataProduccionFinca";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

interface ApiculturaSectionProps {
  control: Control<CreateProduccionFinca>;
}

const ApiculturaSection: React.FC<ApiculturaSectionProps> = ({ control }) => {
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;

  const dynamicStyles = {
    container: {
      marginTop: isSmallScreen ? 6 : 8,
      gap: isSmallScreen ? 12 : 16,
    },
    sectionTitle: {
      fontSize: isSmallScreen ? 16 : 18,
      marginBottom: isSmallScreen ? 6 : 8,
    },
    card: {
      padding: isSmallScreen ? 12 : 16,
      borderRadius: isSmallScreen ? 10 : 12,
    },
    inputLabel: {
      fontSize: isSmallScreen ? 13 : 14,
      marginBottom: isSmallScreen ? 6 : 8,
    },
    input: {
      borderRadius: isSmallScreen ? 6 : 8,
    },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text
        style={[
          styles.sectionTitle,
          dynamicStyles.sectionTitle,
          { color: primary },
        ]}
      >
        Producción Apícola
      </Text>

      <View
        style={[
          styles.card,
          dynamicStyles.card,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            borderColor: colors.outline,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
          Número de colmenas
        </Text>
        <Controller
          control={control}
          name="apicultura.numero_colmenas"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              placeholder="Ej: 25"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
              keyboardType="numeric"
              style={[styles.input, dynamicStyles.input]}
              icon="calculator-sharp"
            />
          )}
        />

        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
          Frecuencia de cosecha
        </Text>
        <Controller
          control={control}
          name="apicultura.frecuencia_cosecha"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ej: Cada 2 meses"
              style={[styles.input, dynamicStyles.input]}
              icon="calendar-outline"
            />
          )}
        />

        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
          Cantidad por cosecha (kg)
        </Text>
        <Controller
          control={control}
          name="apicultura.cantidad_por_cosecha"
          render={({ field: { value, onChange } }) => (
            <ThemedTextInput
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? Number(text) : undefined)}
              keyboardType="decimal-pad"
              placeholder="Ej: 150.75"
              style={[styles.input, dynamicStyles.input]}
              icon="trending-up"
            />
          )}
        />

        <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>
          Calidad de la miel
        </Text>
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
    fontWeight: "bold",
  },
  card: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontWeight: "600",
    color: "#333",
  },
  input: {
    backgroundColor: "#F9FAFB",
  },
});

export default ApiculturaSection;
