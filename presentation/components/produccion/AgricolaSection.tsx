import {
  CreateProduccionFinca,
  CultivoTipo,
  Estacionalidad,
} from "@/core/produccion/interface/crear-produccion-finca.interface";
import {
  estacionalidades,
  meses,
  tiposCultivo,
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
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface AgricolaSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: FieldArrayWithId<CreateProduccionFinca, "agricola.cultivos", "id">[];
  append: (obj: {
    tipo: CultivoTipo;
    estacionalidad: Estacionalidad;
    tiempo_estimado_cultivo: string;
    meses_produccion: string[];
    cantidad_producida_hectareas: string;
  }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
}

const AgricolaSection: React.FC<AgricolaSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
}) => {
  const { colors } = useTheme();

  const addNewCultivo = () => {
    append({
      tipo: "" as CultivoTipo,
      estacionalidad: "" as Estacionalidad,
      tiempo_estimado_cultivo: "",
      meses_produccion: [],
      cantidad_producida_hectareas: "",
    });
  };

  const getIconForCultivo = (tipo: string) => {
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
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="sprout"
          size={24}
          color={colors.primary}
        />
        <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>
          Producción Agrícola
        </ThemedText>
      </View>

      {fields.map((field, index) => {
        const currentTipo = watch(`agricola.cultivos.${index}.tipo`);

        return (
          <ThemedView key={field.id} style={[styles.subSection]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                {currentTipo && (
                  <MaterialCommunityIcons
                    name={getIconForCultivo(currentTipo)}
                    size={20}
                    color={colors.primary}
                    style={styles.icon}
                  />
                )}
                <ThemedText style={styles.subSectionTitle}>
                  Cultivo {index + 1}
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
              <ThemedText style={styles.inputLabel}>Tipo de cultivo</ThemedText>
              <Controller
                control={control}
                name={`agricola.cultivos.${index}.tipo`}
                render={({ field: { value, onChange } }) => (
                  <ThemedPicker
                    items={tiposCultivo.map((tipo) => ({
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

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Estacionalidad</ThemedText>
              <Controller
                control={control}
                name={`agricola.cultivos.${index}.estacionalidad`}
                render={({ field: { value, onChange } }) => (
                  <ThemedPicker
                    items={estacionalidades.map((est) => ({
                      label: est,
                      value: est,
                    }))}
                    selectedValue={value}
                    onValueChange={onChange}
                    placeholder="Seleccione estacionalidad"
                    icon="calendar"
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Duración del cultivo
              </ThemedText>
              <Controller
                control={control}
                name={`agricola.cultivos.${index}.tiempo_estimado_cultivo`}
                render={({ field: { value, onChange } }) => (
                  <ThemedTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ej: 6 meses"
                    keyboardType="default"
                  />
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>
                Producción por hectárea
              </ThemedText>
              <Controller
                control={control}
                name={`agricola.cultivos.${index}.cantidad_producida_hectareas`}
                render={({ field: { value, onChange } }) => (
                  <ThemedTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ej: 3000 kg"
                    keyboardType="numeric"
                    icon="scale"
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
                    name={`agricola.cultivos.${index}.meses_produccion`}
                    render={({ field: { value = [], onChange } }) => (
                      <ThemedCheckbox
                        label={mes}
                        value={mes}
                        isSelected={value.includes(mes)}
                        onPress={() => {
                          const newValue = value.includes(mes)
                            ? value.filter((item) => item !== mes)
                            : [...value, mes];
                          onChange(newValue);
                        }}
                      />
                    )}
                  />
                ))}
              </View>
            </View>
          </ThemedView>
        );
      })}

      <ThemedButton
        onPress={addNewCultivo}
        icon="add-outline"
        variant="outline"
        style={styles.addButton}
        title="Agregar otro cultivo"
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

export default AgricolaSection;
