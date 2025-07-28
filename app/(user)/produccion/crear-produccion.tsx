import { CrearProduccionFinca } from "@/core/produccion/accions/crear-produccion-finca";
import {
  CreateProduccionFinca,
  CultivoTipo,
  Estacionalidad,
  InsumoTipo,
  TipoProduccionGanadera,
} from "@/core/produccion/interface/crear-produccion-finca.interface";
import {
  calidadesMiel,
  estacionalidades,
  meses,
  tiposCultivo,
  tiposHeno,
  tiposInsumo,
  tiposProduccion,
  unidadLeche,
} from "@/helpers/data/dataProduccionFinca";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DeleteButton from "@/presentation/theme/components/ui/DeleteButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import {
  SegmentedButtons,
  Text,
  useTheme as usePaperTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

type ProductionSection =
  | "ganadera"
  | "alternativa"
  | "forrajes"
  | "agricola"
  | "apicultura";

const CrearProduccionPage = () => {
  const { user } = useAuthStore();
  const userId = user?.id || "";
  const [section, setSection] = useState<ProductionSection>("ganadera");
  const { colors } = usePaperTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState("");

  const { data: fincas } = useFincasPropietarios(userId);

  const { control, handleSubmit, watch, setValue, getValues, reset } =
    useForm<CreateProduccionFinca>();

  const {
    fields: cultivosFields,
    append: appendCultivo,
    remove: removeCultivo,
  } = useFieldArray({
    control,
    name: "agricola.cultivos",
  });

  const {
    fields: insumosFields,
    append: appendInsumo,
    remove: removeInsumo,
  } = useFieldArray({
    control,
    name: "forrajesInsumo.insumos",
  });

  const {
    fields: actividadesFields,
    append: appendActividad,
    remove: removeActividad,
  } = useFieldArray({
    control,
    name: "alternativa.actividades",
  });

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const sectionButtons = [
    {
      value: "ganadera",
      label: "Ganaderia",
      icon: "cow",
      style: section === "ganadera" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "alternativa",
      label: "Alternativa",
      icon: "swap-horizontal",
      style:
        section === "alternativa" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "forrajes",
      label: "Forrajes",
      icon: "grass",
      style: section === "forrajes" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "agricola",
      label: "Agricola",
      icon: "sprout",
      style: section === "agricola" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "apicultura",
      label: "Apicultura",
      icon: "bee",
      style:
        section === "apicultura" ? { backgroundColor: colors.primary } : {},
    },
  ];

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate && currentDateField) {
      const localDate = new Date(selectedDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setValue(currentDateField as any, formatted);
    }
  };

  const showDatePickerModal = (field: string) => {
    setCurrentDateField(field);
    setShowDatePicker(true);
  };
  const addNewCultivo = () => {
    appendCultivo({
      tipo: "" as CultivoTipo,
      estacionalidad: "" as Estacionalidad,
      tiempo_estimado_cultivo: "",
      meses_produccion: [],
      cantidad_producida_hectareas: "",
    });
  };

  const addNewInsumo = () => {
    appendInsumo({
      tipo: "Heno" as InsumoTipo,
    });
  };

  const addNewActividad = () => {
    appendActividad({
      tipo: "",
      cantidad_producida: "",
      unidad_medida: "",
      ingresos_anuales: undefined,
      descripcion: "",
    });
  };

  const mutate_produccion = useMutation({
    mutationFn: (data: CreateProduccionFinca) => CrearProduccionFinca(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Produccion Creada con exito",
      });
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al ingresar la produccion";

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
    },
  });

  const onSubmit = (data: CreateProduccionFinca) => {
    mutate_produccion.mutate({ ...data, userId: userId });
  };

  const renderGanaderaSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Producción Ganadera</Text>

      <View style={styles.checkboxGroup}>
        <Text style={styles.label}>Tipos de Producción:</Text>
        {tiposProduccion.map((tipo) => (
          <Controller
            key={tipo}
            control={control}
            name="ganadera.tiposProduccion"
            render={({ field: { value = [], onChange } }) => (
              <ThemedCheckbox
                label={tipo}
                value={tipo}
                isSelected={value.includes(tipo)}
                onPress={() => {
                  const newValue = value.includes(tipo)
                    ? value.filter((item) => item !== tipo)
                    : [...value, tipo];
                  onChange(newValue);
                }}
              />
            )}
          />
        ))}
      </View>

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.LECHE
      ) && (
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Producción de Leche</Text>
          <Controller
            control={control}
            name="ganadera.produccionLecheCantidad"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Cantidad de producción"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.produccionLecheUnidad"
            render={({ field: { value, onChange } }) => (
              <ThemedPicker
                items={unidadLeche.map((unidad) => ({
                  label: unidad,
                  value: unidad,
                }))}
                selectedValue={value ?? ""}
                onValueChange={onChange}
                placeholder="Unidad de medida"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.vacasOrdeño"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Vacas en ordeño"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.vacasSecas"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Vacas secas"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.terneros"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Terneros"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <ThemedText style={{ fontWeight: "bold", fontSize: 16 }}>
            Fecha promedio de secado
          </ThemedText>
          <ThemedButton
            variant="outline"
            icon="calendar-outline"
            onPress={() => showDatePickerModal("ganadera.fechaPromedioSecado")}
            title={`${
              watch("ganadera.fechaPromedioSecado") ||
              "Seleccionar fecha promedio de secado"
            }`}
          />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.CARNE_BOVINA
      ) && (
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Producción de Carne Bovina</Text>
          <Controller
            control={control}
            name="ganadera.cabezasEngordeBovino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Cabezas en engorde"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.kilosSacrificioBovino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Kilos de sacrificio"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.OTRO
      ) && (
        <View style={styles.subSection}>
          <Text style={styles.subSectionTitle}>Otro tipo de producción</Text>
          <Controller
            control={control}
            name="ganadera.otroProductoNombre"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Nombre del producto"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.otroProductoUnidadMedida"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Unidad de medida"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.otroProductoProduccionMensual"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Producción mensual"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
        </View>
      )}
    </View>
  );

  const renderAgricolaSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Producción Agrícola</Text>

      {cultivosFields.map((field, index) => (
        <View key={field.id} style={styles.subSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.subSectionTitle}>Cultivo {index + 1}</Text>
            {cultivosFields.length > 1 && (
              <DeleteButton
                onPress={() => removeCultivo(index)}
                style={{ alignSelf: "flex-end", marginBottom: 8 }}
              />
            )}
          </View>

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
                placeholder="Tipo de cultivo"
              />
            )}
          />

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
                placeholder="Estacionalidad"
              />
            )}
          />

          <Controller
            control={control}
            name={`agricola.cultivos.${index}.tiempo_estimado_cultivo`}
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                value={value}
                onChangeText={onChange}
                placeholder="Tiempo estimado de cultivo, Ej: 6 meses"
              />
            )}
          />

          <View style={styles.checkboxGroup}>
            <Text style={styles.label}>Meses de producción:</Text>
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

          <Controller
            control={control}
            name={`agricola.cultivos.${index}.cantidad_producida_hectareas`}
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                value={value}
                onChangeText={onChange}
                placeholder="Cantidad producida por hectárea, Ej: 3000 kg"
              />
            )}
          />
        </View>
      ))}

      <ThemedButton
        onPress={addNewCultivo}
        icon="add-outline"
        title=" Agregar otro cultivo"
      />
    </View>
  );

  const renderForrajesSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Forrajes e Insumos</Text>

      {insumosFields.map((field, index) => (
        <View key={field.id} style={styles.subSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.subSectionTitle}>Insumo {index + 1}</Text>
            {insumosFields.length > 1 && (
              <DeleteButton
                onPress={() => removeInsumo(index)}
                style={{ alignSelf: "flex-end", marginBottom: 8 }}
              />
            )}
          </View>

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
                placeholder="Tipo de insumo"
              />
            )}
          />

          {watch(`forrajesInsumo.insumos.${index}.tipo`) === "Heno" && (
            <>
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
                    placeholder="Tipo de heno"
                  />
                )}
              />

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
                    placeholder="Estacionalidad del heno"
                  />
                )}
              />

              <View style={styles.checkboxGroup}>
                <Text style={styles.label}>Meses de producción de heno:</Text>
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
                            ? value.filter((item) => item !== mes)
                            : [...(value || []), mes];
                          onChange(newValue);
                        }}
                      />
                    )}
                  />
                ))}
              </View>
            </>
          )}

          {watch(`forrajesInsumo.insumos.${index}.tipo`) !== "Heno" && (
            <>
              <Controller
                control={control}
                name={`forrajesInsumo.insumos.${index}.produccion_manzana`}
                render={({ field: { value, onChange } }) => (
                  <ThemedTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Producción por manzana, Ej: 15 toneladas"
                  />
                )}
              />

              <Controller
                control={control}
                name={`forrajesInsumo.insumos.${index}.tiempo_estimado_cultivo`}
                render={({ field: { value, onChange } }) => (
                  <ThemedTextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Tiempo estimado de cultivo, Ej: 3 meses"
                  />
                )}
              />
            </>
          )}
        </View>
      ))}

      <ThemedButton
        onPress={addNewInsumo}
        icon="add-outline"
        title="Agregar otro insumo"
      />
    </View>
  );

  const renderAlternativaSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Actividades Alternativas</Text>

      {actividadesFields.map((field, index) => (
        <View key={field.id} style={styles.subSection}>
          <View style={styles.rowBetween}>
            <Text style={styles.subSectionTitle}>Actividad {index + 1}</Text>
            {actividadesFields.length > 1 && (
              <DeleteButton
                onPress={() => removeActividad(index)}
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

          {watch(`alternativa.actividades.${index}.tipo`) ===
            "Plantas medicinales o aromáticas" && (
            <Controller
              control={control}
              name={`alternativa.actividades.${index}.descripcion`}
              render={({ field: { value, onChange } }) => (
                <ThemedTextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Descripción, Ej: Hierbabuena y manzanilla"
                />
              )}
            />
          )}

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
      />
    </View>
  );

  const renderApiculturaSection = () => (
    <View>
      <Text style={styles.sectionTitle}>Apicultura</Text>

      <Controller
        control={control}
        name="apicultura.numero_colmenas"
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            placeholder="Número de colmenas"
            value={value?.toString()}
            onChangeText={(text) => onChange(text ? Number(text) : undefined)}
            keyboardType="numeric"
          />
        )}
      />

      <Controller
        control={control}
        name="apicultura.frecuencia_cosecha"
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            value={value}
            onChangeText={onChange}
            placeholder="Frecuencia de cosecha, Ej: Cada 2 meses"
          />
        )}
      />

      <Controller
        control={control}
        name="apicultura.cantidad_por_cosecha"
        render={({ field: { value, onChange } }) => (
          <ThemedTextInput
            value={value?.toString()}
            onChangeText={(text) => onChange(text ? Number(text) : undefined)}
            keyboardType="numeric"
            placeholder="Cantidad por cosecha, Ej: 150.75"
          />
        )}
      />

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
            placeholder="Calidad de la miel"
          />
        )}
      />
    </View>
  );

  const renderSection = () => {
    switch (section) {
      case "ganadera":
        return renderGanaderaSection();
      case "agricola":
        return renderAgricolaSection();
      case "forrajes":
        return renderForrajesSection();
      case "alternativa":
        return renderAlternativaSection();
      case "apicultura":
        return renderApiculturaSection();
      default:
        return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.segmentContainer}>
        <SegmentedButtons
          value={section}
          onValueChange={(value) => setSection(value as ProductionSection)}
          buttons={sectionButtons}
        />
      </ThemedView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Controller
            control={control}
            name="fincaId"
            render={({ field: { value, onChange } }) => (
              <ThemedPicker
                items={fincasItems}
                onValueChange={onChange}
                selectedValue={value}
                placeholder="Selecciona una finca"
                icon="podium-outline"
              />
            )}
          />

          <View style={styles.switchGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Producción mixta:</Text>
              <Controller
                control={control}
                name="produccion_mixta"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value ?? false}
                    onValueChange={onChange}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={value ? colors.onPrimary : "#f4f3f4"}
                  />
                )}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Transformación artesanal:</Text>
              <Controller
                control={control}
                name="transformacion_artesanal"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value ?? false}
                    onValueChange={onChange}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={value ? colors.onPrimary : "#f4f3f4"}
                  />
                )}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Consumo propio:</Text>
              <Controller
                control={control}
                name="consumo_propio"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value ?? false}
                    onValueChange={onChange}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={value ? colors.onPrimary : "#f4f3f4"}
                  />
                )}
              />
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Producción para venta:</Text>
              <Controller
                control={control}
                name="produccion_venta"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value ?? false}
                    onValueChange={onChange}
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={value ? colors.onPrimary : "#f4f3f4"}
                  />
                )}
              />
            </View>
          </View>

          {renderSection()}

          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
            disabled={mutate_produccion.isPending}
            icon="save-outline"
            title=" Guardar Producción"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    paddingBottom: 32,
  },
  segmentContainer: {
    marginVertical: 16,
  },
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
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#444",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  checkboxGroup: {
    marginVertical: 8,
  },
  switchGroup: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default CrearProduccionPage;
