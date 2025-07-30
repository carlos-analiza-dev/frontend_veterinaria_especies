import { CreateProduccionFinca } from "@/core/produccion/interface/crear-produccion-finca.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import DeleteButton from "@/presentation/theme/components/ui/DeleteButton";
import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

interface ActividadItem {
  id: string;
  tipo: string;
  cantidad_producida: string;
  unidad_medida: string;
  ingresos_anuales?: number;
}

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
  const addNewActividad = () => {
    append({
      tipo: "",
      cantidad_producida: "",
      unidad_medida: "",
      ingresos_anuales: undefined,
    });
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Actividades Alternativas</Text>

      {fields.map((field, index) => (
        <View key={field.id} style={styles.subSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.subSectionTitle}>Actividad {index + 1}</Text>
            {fields.length > 1 && (
              <DeleteButton
                onPress={() => remove(index)}
                style={{ alignSelf: "flex-end", marginBottom: 8 }}
              />
            )}
          </View>

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
      ))}

      <ThemedButton
        onPress={addNewActividad}
        icon="add-outline"
        title="Agregar otra actividad"
        variant="outline"
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  subSection: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    marginTop: 8,
    borderStyle: "dashed",
  },
});

export default AlternativaSection;
