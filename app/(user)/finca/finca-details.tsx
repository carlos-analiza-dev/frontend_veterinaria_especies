import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useFincasById from "@/hooks/fincas/useFincasById";
import { UsersStackParamList } from "@/presentation/navigation/types";
import EspecieCantidadPicker from "@/presentation/theme/components/EspecieCantidadPicker";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

import { ActualizarFinca } from "@/core/fincas/accions/update-finca";
import { CrearFinca } from "@/core/fincas/interfaces/crear-finca.interface";
import MessageError from "@/presentation/components/MessageError";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";

type RoutePaisProps = RouteProp<UsersStackParamList, "FincaDetailsPage">;

interface DetailsFincaProps {
  route: RoutePaisProps;
}

const FincaDetailsPage = ({ route }: DetailsFincaProps) => {
  const { fincaId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { data: finca, isLoading, isError } = useFincasById(fincaId);
  const [isEditing, setIsEditing] = useState(false);
  const [unidadMedida, setUnidadMedida] = useState<
    "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2"
  >("ha");

  const { handleSubmit, watch, setValue, reset } = useForm<CrearFinca>();

  React.useEffect(() => {
    if (finca?.data && !isEditing) {
      const fincaData = finca.data;
      reset({
        nombre_finca: fincaData.nombre_finca,
        abreviatura: fincaData.abreviatura,
        ubicacion: fincaData.ubicacion,
        cantidad_animales: fincaData.cantidad_animales,
        tamaño_total_hectarea: fincaData.tamaño_total_hectarea,
        area_ganaderia_hectarea: fincaData.area_ganaderia_hectarea,
        tipo_explotacion: fincaData.tipo_explotacion,
        especies_maneja: fincaData.especies_maneja,
      });
      setUnidadMedida("ha");
    }
  }, [finca, isEditing, reset]);

  const explotacionItems = TipoExplotacion.map((exp) => ({
    label: exp.explotacion,
    value: exp.explotacion,
  }));

  const convertirAHectareas = (valor: string, unidad: string): string => {
    const num = parseFloat(valor);
    if (isNaN(num)) return "0";

    switch (unidad) {
      case "mz":
        return (num * 0.7).toString();
      case "m2":
        return (num * 0.0001).toString();
      case "km2":
        return (num * 100).toString();
      case "ac":
        return (num * 0.4047).toString();
      case "ft2":
        return (num * 0.0000092903).toString();
      case "yd2":
        return (num * 0.0000836127).toString();
      default:
        return valor;
    }
  };

  const onSubmit = async (data: CrearFinca) => {
    try {
      if (!data.nombre_finca) {
        Toast.show({
          type: "error",
          text1: "El nombre de la finca es requerido",
        });
        return;
      }

      const fincaData = {
        nombre_finca: data.nombre_finca,
        cantidad_animales: Number(data.cantidad_animales),
        ubicacion: data.ubicacion,
        abreviatura: data.abreviatura,
        tamaño_total_hectarea: convertirAHectareas(
          data.tamaño_total_hectarea,
          unidadMedida
        ),
        area_ganaderia_hectarea: convertirAHectareas(
          data.area_ganaderia_hectarea,
          unidadMedida
        ),
        tipo_explotacion: data.tipo_explotacion,
        especies_maneja: data.especies_maneja,
      };

      const response = await ActualizarFinca(fincaId, fincaData);

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Finca actualizada correctamente",
        });
        setIsEditing(false);
        reset();
        queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "No se pudo actualizar la finca",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (isError || !finca) {
    return (
      <ThemedView style={styles.container}>
        <MessageError
          titulo="No se encontro la finca"
          descripcion="Error al cargar la información de la finca"
        />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <ThemedView style={styles.formContainer}>
              <ThemedTextInput
                placeholder="Nombre finca"
                icon="home-outline"
                value={watch("nombre_finca")}
                onChangeText={(text) => setValue("nombre_finca", text)}
              />

              <ThemedTextInput
                placeholder="Abreviatura"
                icon="language-outline"
                value={watch("abreviatura")}
                onChangeText={(text) => setValue("abreviatura", text)}
              />

              <ThemedTextInput
                placeholder="Ubicación"
                icon="location-outline"
                value={watch("ubicacion")}
                onChangeText={(text) => setValue("ubicacion", text)}
              />

              <ThemedTextInput
                placeholder="# Animales"
                icon="paw-outline"
                keyboardType="numeric"
                value={watch("cantidad_animales")?.toString() ?? ""}
                onChangeText={(text) =>
                  setValue("cantidad_animales", Number(text))
                }
              />

              <ThemedView style={styles.unidadesContainer}>
                <ThemedText style={styles.unidadLabel}>
                  Unidad de medida:
                </ThemedText>
                <ThemedView style={styles.checkboxGroup}>
                  {(["ha", "mz", "m2", "ac"] as const).map((unidad) => (
                    <TouchableWithoutFeedback
                      key={unidad}
                      onPress={() => setUnidadMedida(unidad)}
                    >
                      <ThemedView style={styles.checkboxContainer}>
                        <Checkbox
                          status={
                            unidadMedida === unidad ? "checked" : "unchecked"
                          }
                          color={colors.primary}
                        />
                        <ThemedText>
                          {unidad === "ha"
                            ? "Hectárea (ha)"
                            : unidad === "mz"
                            ? "Manzana (mz)"
                            : unidad === "m2"
                            ? "Metros cuadrados (m²)"
                            : "Acre (ac)"}
                        </ThemedText>
                      </ThemedView>
                    </TouchableWithoutFeedback>
                  ))}
                </ThemedView>
              </ThemedView>

              <ThemedTextInput
                placeholder={`Tamaño (${unidadMedida})`}
                icon="map-outline"
                value={watch("tamaño_total_hectarea")}
                onChangeText={(text) => setValue("tamaño_total_hectarea", text)}
                keyboardType="numeric"
              />

              <ThemedTextInput
                placeholder={`Área ganadería (${unidadMedida})`}
                icon="layers-outline"
                value={watch("area_ganaderia_hectarea")}
                onChangeText={(text) =>
                  setValue("area_ganaderia_hectarea", text)
                }
                keyboardType="numeric"
              />

              <ThemedPicker
                items={explotacionItems}
                icon="settings-outline"
                placeholder="Tipo de explotación"
                selectedValue={watch("tipo_explotacion")}
                onValueChange={(value) => setValue("tipo_explotacion", value)}
              />

              <EspecieCantidadPicker
                value={watch("especies_maneja") || []}
                onChange={(val) => setValue("especies_maneja", val)}
                cantidadTotal={Number(watch("cantidad_animales")) || 0}
              />

              <ThemedView style={styles.buttonGroup}>
                <ThemedButton
                  title="editar Finca"
                  onPress={handleSubmit(onSubmit)}
                  style={styles.submitButton}
                />
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
  },
  readOnlyContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 12,
  },
  editButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#f44336",
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  unidadesContainer: {
    marginVertical: 12,
  },
  unidadLabel: {
    marginBottom: 8,
    fontWeight: "500",
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginVertical: 4,
  },
});

export default FincaDetailsPage;
