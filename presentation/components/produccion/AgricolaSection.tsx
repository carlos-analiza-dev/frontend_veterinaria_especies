import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import {
  CreateProduccionFinca,
  CultivoTipo,
} from "@/core/produccion/interface/crear-produccion-finca.interface";
import { meses, tiposCultivo } from "@/helpers/data/dataProduccionFinca";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DeleteButton from "@/presentation/theme/components/ui/DeleteButton";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { Dimensions, StyleSheet, View } from "react-native";

interface AgricolaSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: FieldArrayWithId<CreateProduccionFinca, "agricola.cultivos", "id">[];
  append: (obj: {
    tipo: CultivoTipo;
    estacionalidad: string;
    tiempo_estimado_cultivo: string;
    meses_produccion: string[];
    cantidad_producida_hectareas: string;
  }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
  fincaSeleccionada: Finca;
}

const AgricolaSection: React.FC<AgricolaSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
  fincaSeleccionada,
}) => {
  const primary = useThemeColor({}, "primary");
  const error = useThemeColor({}, "error");
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;

  const dynamicStyles = {
    container: {
      marginVertical: isSmallScreen ? 12 : 16,
      paddingHorizontal: isSmallScreen ? 8 : 12,
    },
    header: {
      marginBottom: isSmallScreen ? 12 : 16,
    },
    sectionTitle: {
      fontSize: isSmallScreen ? 16 : 18,
    },
    subSection: {
      padding: isSmallScreen ? 12 : 16,
      marginBottom: isSmallScreen ? 16 : 20,
      borderRadius: isSmallScreen ? 8 : 12,
    },
    inputGroup: {
      marginBottom: isSmallScreen ? 12 : 16,
    },
    inputLabel: {
      fontSize: isSmallScreen ? 13 : 14,
    },
    checkboxContainer: {
      gap: isSmallScreen ? 8 : 12,
    },
    checkboxItem: {
      width: isSmallScreen ? "45%" : "30%",
      minWidth: isSmallScreen ? 80 : 100,
    },
    iconSize: isSmallScreen ? 20 : 24,
    subSectionTitle: {
      fontSize: isSmallScreen ? 15 : 16,
    },
    addButton: {
      marginTop: isSmallScreen ? 4 : 8,
    },
  };

  const addNewCultivo = () => {
    append({
      tipo: "" as CultivoTipo,
      estacionalidad: "",
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
    <ThemedView style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <MaterialCommunityIcons
          name="sprout"
          size={dynamicStyles.iconSize}
          color={primary}
        />
        <ThemedText
          style={[
            styles.sectionTitle,
            dynamicStyles.sectionTitle,
            { color: primary },
          ]}
        >
          Producción Agrícola
        </ThemedText>
      </View>

      {fields.map((field, index) => {
        const currentTipo = watch(`agricola.cultivos.${index}.tipo`);

        return (
          <ThemedView
            key={field.id}
            style={[styles.subSection, dynamicStyles.subSection]}
          >
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                {currentTipo && (
                  <MaterialCommunityIcons
                    name={getIconForCultivo(currentTipo)}
                    size={dynamicStyles.iconSize - 4}
                    color={primary}
                    style={styles.icon}
                  />
                )}
                <ThemedText
                  style={[
                    styles.subSectionTitle,
                    dynamicStyles.subSectionTitle,
                  ]}
                >
                  Cultivo {index + 1}
                </ThemedText>
              </View>

              {fields.length > 1 && (
                <DeleteButton onPress={() => remove(index)} textColor={error} />
              )}
            </View>

            <View style={[styles.inputGroup, dynamicStyles.inputGroup]}>
              <ThemedText style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                Tipo de cultivo
              </ThemedText>
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

            <View style={[styles.inputGroup, dynamicStyles.inputGroup]}>
              <ThemedText style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                Estacionalidad
              </ThemedText>
              <Controller
                control={control}
                name={`agricola.cultivos.${index}.estacionalidad`}
                render={({ field: { value, onChange } }) => (
                  <ThemedTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Estacionalidad de cosecha"
                    keyboardType="default"
                    icon="calendar"
                  />
                )}
              />
            </View>

            <View style={[styles.inputGroup, dynamicStyles.inputGroup]}>
              <ThemedText style={[styles.inputLabel, dynamicStyles.inputLabel]}>
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

            <View style={[styles.inputGroup, dynamicStyles.inputGroup]}>
              <ThemedText style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                Producción por {fincaSeleccionada.medida_finca}
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

            <View style={[styles.inputGroup, dynamicStyles.inputGroup]}>
              <ThemedText style={[styles.inputLabel, dynamicStyles.inputLabel]}>
                Meses de producción
              </ThemedText>
              <View
                style={[
                  styles.checkboxContainer,
                  dynamicStyles.checkboxContainer,
                ]}
              >
                {meses.map((mes) => (
                  <View key={mes} style={[styles.checkboxItem]}>
                    <Controller
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
                  </View>
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
        title="Agregar otro cultivo"
        textStyle={{ fontSize: dynamicStyles.inputLabel.fontSize }}
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
  },
  sectionTitle: {
    marginLeft: 8,
    fontWeight: "600",
  },
  subSection: {
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
  },
  checkboxItem: {
    marginBottom: 8,
  },
  addButton: {
    borderStyle: "dashed",
  },
});

export default AgricolaSection;
