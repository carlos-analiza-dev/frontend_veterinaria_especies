import { CreateProduccionFinca } from "@/core/produccion/interface/crear-produccion-finca.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import DeleteButton from "@/presentation/theme/components/ui/DeleteButton";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

interface AlternativaSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: FieldArrayWithId<
    CreateProduccionFinca,
    "alternativa.actividades",
    "id"
  >[];
  append: (obj: {
    tipo: string;
    cantidad_producida: string;
    unidad_medida: string;
    ingresos_anuales?: number;
  }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
}

const AlternativaSection: React.FC<AlternativaSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
}) => {
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    sectionTitle: {
      fontSize: isSmallScreen ? 18 : isMediumScreen ? 19 : 20,
      marginVertical: isSmallScreen ? 12 : 16,
    },
    subSection: {
      padding: isSmallScreen ? 12 : 16,
      marginBottom: isSmallScreen ? 16 : 24,
      borderRadius: isSmallScreen ? 6 : 8,
    },
    subSectionTitle: {
      fontSize: isSmallScreen ? 16 : 18,
      marginBottom: isSmallScreen ? 8 : 12,
    },
    inputMargin: {
      marginBottom: isSmallScreen ? 10 : 12,
    },
    addButton: {
      marginTop: isSmallScreen ? 6 : 8,
    },
    deleteButton: {
      marginBottom: isSmallScreen ? 6 : 8,
    },
  };

  const addNewActividad = () => {
    append({
      tipo: "",
      cantidad_producida: "",
      unidad_medida: "",
      ingresos_anuales: undefined,
    });
  };

  return (
    <View style={{ paddingHorizontal: isSmallScreen ? 10 : 16 }}>
      <Text
        style={[
          styles.sectionTitle,
          dynamicStyles.sectionTitle,
          { color: primary },
        ]}
      >
        Actividades Alternativas
      </Text>

      {fields.map((field, index) => (
        <View
          key={field.id}
          style={[styles.subSection, dynamicStyles.subSection]}
        >
          <View style={styles.rowBetween}>
            <Text
              style={[
                styles.subSectionTitle,
                dynamicStyles.subSectionTitle,
                { color: colors.onSurface },
              ]}
            >
              Actividad {index + 1}
            </Text>
            {fields.length > 1 && (
              <DeleteButton
                onPress={() => remove(index)}
                style={[styles.deleteButton, dynamicStyles.deleteButton]}
              />
            )}
          </View>

          <View style={dynamicStyles.inputMargin}>
            <Controller
              control={control}
              name={`alternativa.actividades.${index}.tipo`}
              render={({ field: { value, onChange } }) => (
                <ThemedTextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tipo de actividad, Ej: Abonos orgánicos"
                />
              )}
            />
          </View>

          <View style={dynamicStyles.inputMargin}>
            <Controller
              control={control}
              name={`alternativa.actividades.${index}.cantidad_producida`}
              render={({ field: { value, onChange } }) => (
                <ThemedTextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Cantidad producida, Ej: 500 kg"
                />
              )}
            />
          </View>

          <View style={dynamicStyles.inputMargin}>
            <Controller
              control={control}
              name={`alternativa.actividades.${index}.unidad_medida`}
              render={({ field: { value, onChange } }) => (
                <ThemedTextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Unidad de medida, Ej: kilogramos"
                />
              )}
            />
          </View>

          <View style={dynamicStyles.inputMargin}>
            <Controller
              control={control}
              name={`alternativa.actividades.${index}.ingresos_anuales`}
              render={({ field: { value, onChange } }) => (
                <ThemedTextInput
                  value={value?.toString()}
                  onChangeText={(text) =>
                    onChange(text ? Number(text) : undefined)
                  }
                  keyboardType="numeric"
                  placeholder="Ingresos anuales, Ej: 1200"
                />
              )}
            />
          </View>
        </View>
      ))}

      <ThemedButton
        onPress={addNewActividad}
        icon="add-outline"
        title="Agregar otra actividad"
        variant="outline"
        textStyle={{ fontSize: isSmallScreen ? 14 : 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
  },
  subSection: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subSectionTitle: {
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    borderStyle: "dashed",
  },
  deleteButton: {
    alignSelf: "flex-end",
  },
});

export default AlternativaSection;
