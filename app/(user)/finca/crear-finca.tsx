import { CreateFinca } from "@/core/fincas/accions/crear-finca";
import { CrearFinca } from "@/core/fincas/interfaces/crear-finca.interface";
import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import MapaSeleccionDireccion from "@/presentation/components/mapas/MapaSeleccionDireccion";
import EspecieCantidadPicker from "@/presentation/theme/components/EspecieCantidadPicker";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Checkbox, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearFincaPage = () => {
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const [unidadMedida, setUnidadMedida] = useState<
    "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2"
  >("ha");
  const [explotacionSeleccionada, setExplotacionSeleccionada] = useState<
    string[]
  >([]);
  const { width, height } = Dimensions.get("window");

  const { handleSubmit, watch, setValue, reset } = useForm<CrearFinca>({
    defaultValues: {
      especies_maneja: [],
    },
  });

  const { colors } = useTheme();
  const { user } = useAuthStore();
  const selectedDeptoId = watch("departamentoId");
  const selectedPaisId = watch("pais_id");

  const styles = StyleSheet.create({
    container: {
      padding: width * 0.04,
      paddingBottom: height * 0.05,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: height * 0.015,
    },
    scrollContainer: {
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.03,
      justifyContent: "center",
      minHeight: height * 0.8,
    },
    column: {
      flex: 1,
      marginHorizontal: width * 0.01,
    },
    submitButton: {
      paddingVertical: height * 0.015,
    },
    unidadesContainer: {
      marginVertical: height * 0.02,
      marginHorizontal: width * 0.01,
    },
    unidadLabel: {
      marginBottom: height * 0.01,
      fontWeight: "500",
      fontSize: width * 0.04,
    },
    checkboxGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: width * 0.04,
      marginVertical: height * 0.005,
      width: width * 0.45,
    },
    conversionText: {
      fontSize: width * 0.03,
      color: "#666",
      marginTop: height * 0.005,
      marginLeft: width * 0.02,
    },
    sectionContainer: {
      marginBottom: height * 0.02,
      width: "100%",
    },
    sectionTitle: {
      fontSize: width * 0.045,
      fontWeight: "bold",
      marginBottom: height * 0.015,
      color: "#333",
    },
    errorText: {
      color: "red",
      fontSize: width * 0.035,
      marginTop: height * 0.01,
    },
    formContainer: {
      flex: 1,
    },
    selectedMeasure: {
      fontSize: width * 0.038,
      fontWeight: "bold",
      color: "#333",
      marginBottom: height * 0.01,
    },
    input: {
      marginBottom: height * 0.015,
      fontSize: width * 0.04,
    },
    pickerContainer: {
      marginBottom: height * 0.015,
    },
    mapButton: {
      height: height * 0.06,
    },
  });

  const { data: deptos } = useGetDeptosActivesByPais(selectedPaisId);
  const { data: municipios } = useGetMunicipiosActivosByDepto(selectedDeptoId);
  const { data: paises } = useGetPaisesActivos();

  const departmentItems =
    deptos?.data.map((depto) => ({
      label: depto.nombre,
      value: depto.id.toString(),
    })) || [];

  const municipiosItems =
    municipios?.data.map((mun) => ({
      label: mun.nombre,
      value: mun.id.toString(),
    })) || [];

  const paisesItems =
    paises?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id.toString(),
    })) || [];

  const onSubmit = async (data: CrearFinca) => {
    try {
      if (!data.nombre_finca) {
        Toast.show({
          type: "error",
          text1: "El nombre de la finca es requerido",
        });
        return;
      }
      if (!data.cantidad_animales || isNaN(Number(data.cantidad_animales))) {
        Toast.show({
          type: "error",
          text1: "Cantidad de animales debe ser un número válido",
        });
        return;
      }
      if (!data.ubicacion) {
        Toast.show({ type: "error", text1: "La ubicación es requerida" });
        return;
      }
      if (!data.pais_id) {
        Toast.show({ type: "error", text1: "Debe seleccionar un país" });
        return;
      }
      if (!data.departamentoId) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar un departamento",
        });
        return;
      }
      if (!data.municipioId) {
        Toast.show({ type: "error", text1: "Debe seleccionar un municipio" });
        return;
      }
      if (!data.tipo_explotacion) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar un tipo de explotación",
        });
        return;
      }
      if (!data.especies_maneja || data.especies_maneja.length === 0) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar al menos una especie",
        });
        return;
      }

      const sumaEspecies = data.especies_maneja.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );
      if (sumaEspecies !== Number(data.cantidad_animales)) {
        Toast.show({
          type: "error",
          text1: "La suma de especies no coincide",
          text2: `La suma debe ser igual a ${data.cantidad_animales}`,
        });
        return;
      }

      const fincaData = {
        nombre_finca: data.nombre_finca,
        cantidad_animales: Number(data.cantidad_animales),
        medida_finca: unidadMedida,
        ubicacion: data.ubicacion,
        longitud: data.longitud,
        latitud: data.latitud,
        abreviatura: data.abreviatura,
        departamentoId: data.departamentoId,
        municipioId: data.municipioId,
        tamaño_total_hectarea: data.tamaño_total_hectarea,
        area_ganaderia_hectarea: data.area_ganaderia_hectarea,
        tipo_explotacion: data.tipo_explotacion,
        especies_maneja: data.especies_maneja,
        propietario_id: user?.id || "",
        pais_id: data.pais_id || "",
      };

      const response = await CreateFinca(fincaData);
      queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });
      if (response.status === 201) {
        Toast.show({ type: "success", text1: "Finca creada correctamente" });
        setExplotacionSeleccionada([]);
        reset();
        navigation.goBack();
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al crear la finca";

        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado",
          text2: "Contacte al administrador",
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({
        ios: height * 0.1,
        android: height * 0.05,
      })}
    >
      <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { minHeight: height * 0.8 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
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
              style={styles.input}
            />
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
              <View pointerEvents="box-only">
                <ThemedTextInput
                  placeholder="Ubicación"
                  icon="location-outline"
                  value={watch("ubicacion")}
                  editable={false}
                  style={styles.input}
                />
              </View>
            </TouchableWithoutFeedback>

            <MapaSeleccionDireccion
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              onLocationSelect={(direccion, coords) => {
                setValue("ubicacion", direccion);
                setValue("latitud", coords.latitude);
                setValue("longitud", coords.longitude);
              }}
            />

            <ThemedView
              style={[styles.row, { backgroundColor: colors.background }]}
            >
              <ThemedView
                style={[styles.column, { backgroundColor: colors.background }]}
              >
                <ThemedTextInput
                  placeholder="# Animales"
                  icon="paw-outline"
                  keyboardType="numeric"
                  value={watch("cantidad_animales")?.toString() ?? ""}
                  onChangeText={(text) =>
                    setValue("cantidad_animales", Number(text))
                  }
                  style={styles.input}
                />
              </ThemedView>
              <ThemedView
                style={[styles.column, { backgroundColor: colors.background }]}
              >
                <ThemedTextInput
                  placeholder="Abreviatura"
                  icon="text-outline"
                  value={watch("abreviatura")}
                  onChangeText={(text) => setValue("abreviatura", text)}
                  style={styles.input}
                />
              </ThemedView>
            </ThemedView>

            <ThemedPicker
              items={paisesItems}
              icon="earth"
              placeholder="Selecciona un país"
              selectedValue={watch("pais_id")}
              onValueChange={(value) => setValue("pais_id", value)}
            />

            {selectedPaisId && (
              <ThemedPicker
                items={departmentItems}
                icon="map"
                placeholder="Departamento"
                selectedValue={selectedDeptoId}
                onValueChange={(value) => {
                  setValue("departamentoId", value);
                  setValue("municipioId", "");
                }}
              />
            )}

            {selectedDeptoId && (
              <ThemedPicker
                items={municipiosItems}
                icon="pin"
                placeholder="Municipio"
                selectedValue={watch("municipioId")}
                onValueChange={(value) => setValue("municipioId", value)}
              />
            )}
            <ThemedView
              style={[
                styles.unidadesContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedText style={styles.unidadLabel}>
                ¿Con qué medidas conoces tu finca?
              </ThemedText>
              <ThemedText style={styles.selectedMeasure}>
                Medida seleccionada: {unidadMedida}
              </ThemedText>

              <ThemedView
                style={[
                  styles.checkboxGroup,
                  { backgroundColor: colors.background },
                ]}
              >
                <TouchableWithoutFeedback onPress={() => setUnidadMedida("ha")}>
                  <ThemedView
                    style={[
                      styles.checkboxContainer,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Checkbox
                      status={unidadMedida === "ha" ? "checked" : "unchecked"}
                      color={colors.primary}
                    />
                    <ThemedText>Hectárea (ha)</ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setUnidadMedida("mz")}>
                  <ThemedView
                    style={[
                      styles.checkboxContainer,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Checkbox
                      status={unidadMedida === "mz" ? "checked" : "unchecked"}
                      color={colors.primary}
                    />
                    <ThemedText>Manzana (mz)</ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => setUnidadMedida("m2")}>
                  <ThemedView
                    style={[
                      styles.checkboxContainer,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Checkbox
                      status={unidadMedida === "m2" ? "checked" : "unchecked"}
                      color={colors.primary}
                    />
                    <ThemedText>Metros cuadrados (m²)</ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setUnidadMedida("ac")}>
                  <ThemedView
                    style={[
                      styles.checkboxContainer,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Checkbox
                      status={unidadMedida === "ac" ? "checked" : "unchecked"}
                      color={colors.primary}
                    />
                    <ThemedText>Acres (ac)</ThemedText>
                  </ThemedView>
                </TouchableWithoutFeedback>
              </ThemedView>
            </ThemedView>

            <ThemedTextInput
              placeholder={`Tamaño total (${unidadMedida})`}
              icon="map-outline"
              value={watch("tamaño_total_hectarea")}
              onChangeText={(text) => setValue("tamaño_total_hectarea", text)}
              keyboardType="numeric"
              style={styles.input}
            />

            <ThemedView
              style={[styles.column, { backgroundColor: colors.background }]}
            >
              <ThemedTextInput
                placeholder={`Área de ganadería (${unidadMedida})`}
                icon="layers-outline"
                value={watch("area_ganaderia_hectarea")}
                onChangeText={(text) =>
                  setValue("area_ganaderia_hectarea", text)
                }
                keyboardType="numeric"
                style={styles.input}
              />
            </ThemedView>

            <ThemedView
              style={[
                styles.sectionContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <ThemedText style={styles.sectionTitle}>
                Tipo de explotación
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

            <ThemedView
              style={{ marginBottom: height * 0.02, marginTop: height * 0.03 }}
            >
              <ThemedButton
                title="Guardar Finca"
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default CrearFincaPage;
