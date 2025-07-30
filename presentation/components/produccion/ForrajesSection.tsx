import {
  CreateProduccionFinca,
  InsumoTipo,
} from "@/core/produccion/interface/crear-produccion-finca.interface";
import {
  estacionalidades,
  meses,
  tiposHeno,
  tiposInsumo,
} from "@/helpers/data/dataProduccionFinca";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DeleteButton from "@/presentation/theme/components/ui/DeleteButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface InsumoItem {
  id: string;
  tipo: InsumoTipo;
  tipo_heno?: string;
  estacionalidad_heno?: string;
  meses_produccion_heno?: string[];
  produccion_manzana?: string;
  tiempo_estimado_cultivo?: string;
}

interface ForrajesSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: InsumoItem[];
  append: (obj: { tipo: InsumoTipo }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
}

const ForrajesSection: React.FC<ForrajesSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
}) => {
  const { colors } = useTheme();

  const addNewInsumo = () => {
    append({
      tipo: "Heno" as InsumoTipo,
    });
  };

  const getIconForInsumo = (tipo: InsumoTipo) => {
    switch (tipo) {
      case "Heno":
        return "grass";
      case "Silo":
        return "corn";
      case "Pasto":
        return "sprout";
      case "Harina":
        return "sprout";
      case "Alimentos Concentrados elaborados":
        return "sprout";
      default:
        return "barn";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="barn" size={24} color={colors.primary} />
        <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
          Forrajes e Insumos
        </ThemedText>
      </View>

      {fields.map((field, index) => {
        const currentTipo = watch(`forrajesInsumo.insumos.${index}.tipo`);

        return (
          <ThemedView key={field.id} style={[styles.subSection]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                {currentTipo && (
                  <MaterialCommunityIcons
                    name={getIconForInsumo(currentTipo)}
                    size={20}
                    color={colors.primary}
                    style={styles.icon}
                  />
                )}
                <ThemedText style={styles.subSectionTitle}>
                  Insumo {index + 1}
                </ThemedText>
              </View>

              {fields.length > 1 && (
                <DeleteButton
                  onPress={() => remove(index)}
                  textColor={colors.error}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Tipo de insumo</ThemedText>
              <Controller
                control={control}
                name={`forrajesInsumo.insumos.${index}.tipo`}
                render={({ field: { value, onChange } }) => (
                  <ThemedPicker
                    items={tiposInsumo.map((tipo) => ({
                      label: tipo,
                      value: tipo,
                    }))}
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder="Seleccione un tipo"
                    icon="chevron-down"
                  />
                )}
              />
            </View>

            {currentTipo === "Heno" ? (
              <>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Tipo de heno
                  </ThemedText>
                  <Controller
                    control={control}
                    name={`forrajesInsumo.insumos.${index}.tipo_heno`}
                    render={({ field: { value, onChange } }) => (
                      <ThemedPicker
                        items={tiposHeno.map((tipo) => ({
                          label: tipo,
                          value: tipo,
                        }))}
                        selectedValue={value ?? ""}
                        onValueChange={onChange}
                        placeholder="Seleccione tipo de heno"
                        icon="options-outline"
                      />
                    )}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Estacionalidad
                  </ThemedText>
                  <Controller
                    control={control}
                    name={`forrajesInsumo.insumos.${index}.estacionalidad_heno`}
                    render={({ field: { value, onChange } }) => (
                      <ThemedPicker
                        items={estacionalidades.map((est) => ({
                          label: est,
                          value: est,
                        }))}
                        selectedValue={value ?? ""}
                        onValueChange={onChange}
                        placeholder="Seleccione estacionalidad"
                        icon="calendar"
                      />
                    )}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Meses de producción
                  </ThemedText>
                  <View style={styles.checkboxContainer}>
                    {meses.map((mes) => (
                      <Controller
                        key={mes}
                        control={control}
                        name={`forrajesInsumo.insumos.${index}.meses_produccion_heno`}
                        render={({ field: { value = [], onChange } }) => (
                          <ThemedCheckbox
                            label={mes}
                            value={mes}
                            isSelected={value?.includes(mes)}
                            onPress={() => {
                              const newValue = value?.includes(mes)
                                ? value.filter((item: string) => item !== mes)
                                : [...(value || []), mes];
                              onChange(newValue);
                            }}
                          />
                        )}
                      />
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Producción por manzana
                  </ThemedText>
                  <Controller
                    control={control}
                    name={`forrajesInsumo.insumos.${index}.produccion_manzana`}
                    render={({ field: { value, onChange } }) => (
                      <ThemedTextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Ej: 15 toneladas"
                        keyboardType="numeric"
                        icon="scale"
                      />
                    )}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Tiempo estimado
                  </ThemedText>
                  <Controller
                    control={control}
                    name={`forrajesInsumo.insumos.${index}.tiempo_estimado_cultivo`}
                    render={({ field: { value, onChange } }) => (
                      <ThemedTextInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Ej: 3 meses"
                        keyboardType="default"
                        icon="close-outline"
                      />
                    )}
                  />
                </View>
              </>
            )}
          </ThemedView>
        );
      })}

      <ThemedButton
        onPress={addNewInsumo}
        icon="add-outline"
        variant="outline"
        style={styles.addButton}
        title="Agregar otro insumo"
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  subSection: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#f9f9f9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  subSectionTitle: {
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    opacity: 0.8,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 12,
  },
  checkboxItem: {
    width: "30%",
    minWidth: 100,
  },
  addButton: {
    marginTop: 8,
    borderStyle: "dashed",
  },
});

export default ForrajesSection;
