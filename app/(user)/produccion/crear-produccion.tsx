import { CrearProduccionFinca } from "@/core/produccion/accions/crear-produccion-finca";
import { CreateProduccionFinca } from "@/core/produccion/interface/crear-produccion-finca.interface";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import AgricolaSection from "@/presentation/components/produccion/AgricolaSection";
import AlternativaSection from "@/presentation/components/produccion/AlternativaSection";
import ApiculturaSection from "@/presentation/components/produccion/ApiculturaSection";
import ForrajesSection from "@/presentation/components/produccion/ForrajesSection";
import GanaderaSection from "@/presentation/components/produccion/GanaderaSection";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
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
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [section, setSection] = useState<ProductionSection>("ganadera");
  const { colors } = usePaperTheme();
  const primary = useThemeColor({}, "primary");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateField, setCurrentDateField] = useState("");
  const { data: fincas } = useFincasPropietarios(userId);

  const { control, handleSubmit, watch, setValue, reset } =
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
      description: "Registro de producción ganadera (leche, carne, etc.)",
      style: section === "ganadera" ? { backgroundColor: primary } : {},
      labelStyle: section === "ganadera" ? { color: "#fff" } : {},
    },
    {
      value: "forrajes",
      label: "Forrajes",
      icon: "grass",
      description: "Gestión de producción de forrajes para alimentación animal",
      style: section === "forrajes" ? { backgroundColor: primary } : {},
      labelStyle: section === "forrajes" ? { color: "#fff" } : {},
    },
    {
      value: "agricola",
      label: "Agricola",
      icon: "sprout",
      description: "Registro de cultivos y producción agrícola",
      style: section === "agricola" ? { backgroundColor: primary } : {},
      labelStyle: section === "agricola" ? { color: "#fff" } : {},
    },
    {
      value: "apicultura",
      label: "Apicultura",
      icon: "bee",
      description: "Producción de miel y derivados apícolas",
      style: section === "apicultura" ? { backgroundColor: primary } : {},
      labelStyle: section === "apicultura" ? { color: "#fff" } : {},
    },
    {
      value: "alternativa",
      label: "Alternativa",
      icon: "swap-horizontal",
      description: "Otras actividades productivas alternativas",
      style: section === "alternativa" ? { backgroundColor: primary } : {},
      labelStyle: section === "alternativa" ? { color: "#fff" } : {},
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

  const mutate_produccion = useMutation({
    mutationFn: (data: CreateProduccionFinca) => CrearProduccionFinca(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Produccion Creada con exito",
      });
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
      reset();
      navigation.goBack();
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

  const renderSection = () => {
    switch (section) {
      case "ganadera":
        return (
          <GanaderaSection
            control={control}
            showDatePickerModal={showDatePickerModal}
            watch={watch}
          />
        );
      case "agricola":
        return (
          <AgricolaSection
            control={control}
            fields={cultivosFields}
            append={appendCultivo}
            remove={removeCultivo}
            watch={watch}
          />
        );
      case "forrajes":
        return (
          <ForrajesSection
            control={control}
            fields={insumosFields}
            append={appendInsumo}
            remove={removeInsumo}
            watch={watch}
          />
        );
      case "alternativa":
        return (
          <AlternativaSection
            control={control}
            fields={actividadesFields}
            append={appendActividad}
            remove={removeActividad}
            watch={watch}
          />
        );
      case "apicultura":
        return <ApiculturaSection control={control} />;
      default:
        return null;
    }
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
    gap: 16,
  },
  segmentContainer: {
    marginVertical: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  switchGroup: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 8,

    gap: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
});

export default CrearProduccionPage;
