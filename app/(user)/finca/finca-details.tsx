import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useFincasById from "@/hooks/fincas/useFincasById";
import { UsersStackParamList } from "@/presentation/navigation/types";
import EspecieCantidadPicker from "@/presentation/theme/components/EspecieCantidadPicker";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useTheme } from "react-native-paper";

import { ActualizarFinca } from "@/core/fincas/accions/update-finca";
import { CrearFinca } from "@/core/fincas/interfaces/crear-finca.interface";
import MapaSeleccionDireccion from "@/presentation/components/mapas/MapaSeleccionDireccion";
import MessageError from "@/presentation/components/MessageError";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";

type RoutePaisProps = RouteProp<UsersStackParamList, "FincaDetailsPage">;

interface DetailsFincaProps {
  route: RoutePaisProps;
}
type UnidadMedida = "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2";
const FincaDetailsPage = ({ route }: DetailsFincaProps) => {
  const { fincaId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { data: finca, isLoading, isError } = useFincasById(fincaId);
  const [isEditing, setIsEditing] = useState(false);
  const [unidadMedida, setUnidadMedida] = useState<
    "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2"
  >("ha");
  const [explotacionSeleccionada, setExplotacionSeleccionada] = useState<
    string[]
  >([]);

  const { handleSubmit, watch, setValue, reset } = useForm<CrearFinca>();

  React.useEffect(() => {
    if (finca?.data && !isEditing) {
      const fincaData = finca.data;
      const unidadesValidas: UnidadMedida[] = [
        "ha",
        "mz",
        "m2",
        "km2",
        "ac",
        "ft2",
        "yd2",
      ];
      const medidaFinca = unidadesValidas.includes(
        fincaData.medida_finca as UnidadMedida
      )
        ? (fincaData.medida_finca as UnidadMedida)
        : "ha";
      reset({
        nombre_finca: fincaData.nombre_finca,
        abreviatura: fincaData.abreviatura,
        ubicacion: fincaData.ubicacion,
        latitud: fincaData.latitud,
        longitud: fincaData.longitud,
        cantidad_animales: fincaData.cantidad_animales,
        tamaño_total_hectarea: fincaData.tamaño_total_hectarea,
        area_ganaderia_hectarea: fincaData.area_ganaderia_hectarea,
        tipo_explotacion: fincaData.tipo_explotacion,
        especies_maneja: fincaData.especies_maneja,
        medida_finca: fincaData.medida_finca,
      });
      setUnidadMedida(medidaFinca);
      if (finca?.data.tipo_explotacion) {
        const explotacion = finca.data.tipo_explotacion.map(
          (a) => a.tipo_explotacion
        );
        setExplotacionSeleccionada(explotacion);
      }
    }
  }, [finca, isEditing, reset]);

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
        medida_finca: unidadMedida,
        ubicacion: data.ubicacion,
        latitud: data.latitud,
        longitud: data.longitud,
        abreviatura: data.abreviatura,
        tamaño_total_hectarea: data.tamaño_total_hectarea,
        area_ganaderia_hectarea: data.area_ganaderia_hectarea,
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
        navigation.goBack();
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

  const handleAlimentoChange = (alimento: string) => {
    const nuevasExplotacion = [...explotacionSeleccionada];
    if (nuevasExplotacion.includes(alimento)) {
      const index = nuevasExplotacion.indexOf(alimento);
      nuevasExplotacion.splice(index, 1);
    } else {
      nuevasExplotacion.push(alimento);
    }
    setExplotacionSeleccionada(nuevasExplotacion);
    setValue(
      "tipo_explotacion",
      nuevasExplotacion.map((a) => ({ tipo_explotacion: a }))
    );
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
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
            <ThemedView
              style={[
                styles.formContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedTextInput
                placeholder="Nombre finca"
                icon="home-outline"
                value={watch("nombre_finca")}
                onChangeText={(text) => setValue("nombre_finca", text)}
              />
              <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
                <ThemedView
                  pointerEvents="box-only"
                  style={{ backgroundColor: colors.background }}
                >
                  <ThemedTextInput
                    placeholder="Ubicación"
                    icon="location-outline"
                    value={watch("ubicacion")}
                    editable={false}
                  />
                </ThemedView>
              </TouchableWithoutFeedback>

              <MapaSeleccionDireccion
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onLocationSelect={(direccion, coords) => {
                  setValue("ubicacion", direccion);
                  setValue("latitud", coords.latitude);
                  setValue("longitud", coords.longitude);
                }}
                initialCoords={
                  watch("latitud") && watch("longitud")
                    ? {
                        latitude: Number(watch("latitud")),
                        longitude: Number(watch("longitud")),
                      }
                    : undefined
                }
              />

              <ThemedView
                style={[styles.row, { backgroundColor: colors.background }]}
              >
                <ThemedView
                  style={[
                    styles.column,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <ThemedTextInput
                    placeholder="# Animales"
                    icon="paw-outline"
                    keyboardType="numeric"
                    value={watch("cantidad_animales")?.toString() ?? ""}
                    onChangeText={(text) =>
                      setValue("cantidad_animales", Number(text))
                    }
                  />
                </ThemedView>
                <ThemedView
                  style={[
                    styles.column,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <ThemedTextInput
                    placeholder="Abreviatura"
                    icon="text-outline"
                    value={watch("abreviatura")}
                    onChangeText={(text) => setValue("abreviatura", text)}
                  />
                </ThemedView>
              </ThemedView>

              <ThemedView
                style={[
                  styles.unidadesContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <ThemedText style={styles.unidadLabel}>
                  Unidad de medida:
                </ThemedText>
                <ThemedView
                  style={[
                    styles.checkboxGroup,
                    { backgroundColor: colors.background },
                  ]}
                >
                  {(["ha", "mz", "m2", "ac"] as const).map((unidad) => (
                    <TouchableWithoutFeedback
                      key={unidad}
                      onPress={() => setUnidadMedida(unidad)}
                    >
                      <ThemedView
                        style={[
                          styles.checkboxContainer,
                          { backgroundColor: colors.background },
                        ]}
                      >
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

              <ThemedView
                style={[
                  styles.sectionContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <ThemedText style={styles.sectionTitle}>
                  Tipo de explotacion
                </ThemedText>
                {TipoExplotacion.map((explotacion) => (
                  <ThemedCheckbox
                    key={explotacion.id}
                    label={explotacion.explotacion}
                    value={explotacion.explotacion}
                    onPress={handleAlimentoChange}
                    isSelected={explotacionSeleccionada.includes(
                      explotacion.explotacion
                    )}
                  />
                ))}
              </ThemedView>

              <EspecieCantidadPicker
                value={watch("especies_maneja") || []}
                onChange={(val) => setValue("especies_maneja", val)}
                cantidadTotal={Number(watch("cantidad_animales")) || 0}
              />

              <ThemedView style={styles.buttonGroup}>
                <ThemedButton
                  title="Editar Finca"
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
  sectionContainer: {
    marginBottom: 15,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  conversionText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginLeft: 8,
    fontStyle: "italic",
  },
});

export default FincaDetailsPage;
