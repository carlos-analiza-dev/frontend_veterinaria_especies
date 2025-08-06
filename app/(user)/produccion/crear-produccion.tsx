import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
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
import ButtonFilter from "@/presentation/theme/components/ui/ButtonFilter";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { Text, useTheme as usePaperTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 375;
const buttonWidth = width / 3 - 16;

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
  const [fincaSeleccionada, setFincaSeleccionada] = useState<Finca | null>(
    null
  );
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
      disabled: !fincaSeleccionada,
      icon: "cow",
      style: {
        width: buttonWidth,
        ...(section === "ganadera" ? { backgroundColor: primary } : {}),
      },
      labelStyle: section === "ganadera" ? { color: "#fff" } : {},
    },
    {
      value: "forrajes",
      label: "Forrajes",
      disabled: !fincaSeleccionada,
      icon: "grass",
      style: {
        width: buttonWidth,
        ...(section === "forrajes" ? { backgroundColor: primary } : {}),
      },
      labelStyle: section === "forrajes" ? { color: "#fff" } : {},
    },
    {
      value: "agricola",
      label: "Agricola",
      disabled: !fincaSeleccionada,
      icon: "sprout",
      style: {
        width: buttonWidth,
        ...(section === "agricola" ? { backgroundColor: primary } : {}),
      },
      labelStyle: section === "agricola" ? { color: "#fff" } : {},
    },
    {
      value: "apicultura",
      label: "Apicultura",
      disabled: !fincaSeleccionada,
      icon: "bee",
      style: {
        width: buttonWidth,
        ...(section === "apicultura" ? { backgroundColor: primary } : {}),
      },
      labelStyle: section === "apicultura" ? { color: "#fff" } : {},
    },
    {
      value: "alternativa",
      label: "Alternativa",
      disabled: !fincaSeleccionada,
      icon: "swap-horizontal",
      style: {
        width: buttonWidth,
        ...(section === "alternativa" ? { backgroundColor: primary } : {}),
      },
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
    if (!fincaSeleccionada) {
      return (
        <ThemedView style={styles.noFincaSelected}>
          <Text style={styles.noFincaText}>
            Selecciona una finca para habilitar las secciones de producción
          </Text>
        </ThemedView>
      );
    }
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
            fincaSeleccionada={fincaSeleccionada}
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
            fincaSeleccionada={fincaSeleccionada}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.buttonsContainer}>
            {sectionButtons.map((btn) => (
              <ButtonFilter
                key={btn.value}
                title={btn.label}
                onPress={() => setSection(btn.value as ProductionSection)}
                variant={section === btn.value ? "primary" : "outline"}
                disabled={!fincaSeleccionada}
                textStyle={section === btn.value ? { color: "white" } : {}}
              />
            ))}
          </View>

          <Controller
            control={control}
            name="fincaId"
            render={({ field: { value, onChange } }) => (
              <ThemedPicker
                items={fincasItems}
                onValueChange={(selectedValue) => {
                  onChange(selectedValue);
                  const finca = fincas?.data.fincas.find(
                    (f) => f.id === selectedValue
                  );
                  setFincaSeleccionada(finca || null);
                }}
                selectedValue={value}
                placeholder="Selecciona una finca"
                icon="podium-outline"
              />
            )}
          />

          <View style={styles.switchGroup}>
            {[
              { name: "produccion_mixta", label: "Producción mixta" },
              {
                name: "transformacion_artesanal",
                label: "Transformación artesanal",
              },
              { name: "consumo_propio", label: "Consumo propio" },
              { name: "produccion_venta", label: "Producción para venta" },
            ].map((item) => (
              <View key={item.name} style={styles.switchContainer}>
                <Text style={styles.label}>{item.label}:</Text>
                <Controller
                  control={control}
                  name={item.name as any}
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
            ))}
          </View>

          {renderSection()}

          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
            disabled={mutate_produccion.isPending || !fincaSeleccionada}
            icon="save-outline"
            title=" Guardar Producción"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "android" ? "default" : "inline"}
          onChange={handleDateChange}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isSmallDevice ? 12 : 16,
  },
  scrollContainer: {
    paddingBottom: 32,
    gap: isSmallDevice ? 12 : 16,
    minHeight: height * 0.8,
  },
  segmentContainer: {
    marginVertical: isSmallDevice ? 8 : 16,
    alignItems: "center",
  },
  segmentedButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "100%",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  sectionButton: {
    marginBottom: 8,
    paddingVertical: 8,
  },
  pickerContainer: {
    marginBottom: isSmallDevice ? 8 : 16,
  },
  label: {
    fontSize: isSmallDevice ? 14 : 16,
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "70%",
  },
  switchGroup: {
    marginVertical: isSmallDevice ? 8 : 16,
    padding: isSmallDevice ? 12 : 16,
    borderRadius: 8,
    gap: isSmallDevice ? 8 : 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    marginTop: isSmallDevice ? 16 : 24,
    paddingVertical: isSmallDevice ? 10 : 12,
  },
  noFincaSelected: {
    marginTop: isSmallDevice ? 12 : 20,
    padding: isSmallDevice ? 12 : 16,
    borderRadius: 8,
    alignItems: "center",
  },
  noFincaText: {
    fontSize: isSmallDevice ? 14 : 16,
    textAlign: "center",
  },
});

export default CrearProduccionPage;
