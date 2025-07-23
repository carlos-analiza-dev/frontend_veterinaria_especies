import { CrearAnalisisSuelo } from "@/core/analisis_suelo/core/crear-analisis-suelo";
import { EditarAnalisisSuelo } from "@/core/analisis_suelo/core/editar-analisis-suelo";
import { CrearAnalisisInterface } from "@/core/analisis_suelo/interface/crear-analisis.interface";
import { Analisis } from "@/core/analisis_suelo/interface/response-analisis-suelo.interface";
import { CalidadSuelos } from "@/helpers/data/calidadSuelos";
import { tiposSuelos } from "@/helpers/data/tiposSuelo";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Platform, ScrollView, StyleSheet, Switch } from "react-native";
import { Modal, Portal } from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  hideModal: () => void;
  editingAnalisis?: Analisis | null;
}

const ModalAgregarAnalisis = ({
  hideModal,
  visible,
  editingAnalisis,
}: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id ?? "";
  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CrearAnalisisInterface>();

  useEffect(() => {
    if (editingAnalisis) {
      setValue("fechaAnalisis", editingAnalisis.fechaAnalisis);
      setValue("calidadSuelo", editingAnalisis.calidadSuelo);
      setValue("tipoSuelo", editingAnalisis.tipoSuelo);
      setValue("rendimiento", Number(editingAnalisis.rendimiento));
      setValue("eficienciaInsumos", Number(editingAnalisis.eficienciaInsumos));

      if (editingAnalisis.phSuelo) {
        setValue("phSuelo", Number(editingAnalisis.phSuelo));
        setShowPhField(true);
      }

      if (editingAnalisis.materiaOrganica) {
        setValue("materiaOrganica", Number(editingAnalisis.materiaOrganica));
        setShowMateriaOrganicaField(true);
      }

      if (editingAnalisis.observaciones) {
        setValue("observaciones", editingAnalisis.observaciones);
        setShowObservacionesField(true);
      }
    } else {
      reset();
      setShowPhField(false);
      setShowMateriaOrganicaField(false);
      setShowObservacionesField(false);
    }
  }, [editingAnalisis]);

  const allTiposSuelo =
    tiposSuelos.map((suelo) => ({
      value: suelo.value,
      label: suelo.value,
    })) || [];

  const allCalidadSuelo =
    CalidadSuelos.map((suelo) => ({
      value: suelo.value,
      label: suelo.value,
    })) || [];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPhField, setShowPhField] = useState(false);
  const [showMateriaOrganicaField, setShowMateriaOrganicaField] =
    useState(false);
  const [showObservacionesField, setShowObservacionesField] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      const localDate = new Date(selectedDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setValue("fechaAnalisis", formatted);
    }
  };

  const mutation = useMutation({
    mutationFn: (data: CrearAnalisisInterface) => CrearAnalisisSuelo(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Analisis creado exitosamente",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["analisis-suelo"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al crear el analisis";

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

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearAnalisisInterface) =>
      EditarAnalisisSuelo(editingAnalisis?.id ?? "", data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Analisis actualizado exitosamente",
      });
      reset();
      queryClient.invalidateQueries({ queryKey: ["analisis-suelo"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar el analisis";

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

  const onSubmit = (data: CrearAnalisisInterface) => {
    if (editingAnalisis) {
      mutationUpdate.mutate({ ...data, userId });
      hideModal();
    } else {
      mutation.mutate({ ...data, userId });
      hideModal();
      reset();
    }
  };

  const containerStyle = { backgroundColor: "white", padding: 20 };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
        <ScrollView>
          <ThemedText style={styles.sectionTitle}>Fecha de análisis</ThemedText>
          <ThemedView style={styles.dateInputContainer}>
            <ThemedButton
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateIcon}
            />
          </ThemedView>
          <ThemedTextInput
            placeholder="Selecciona una fecha"
            icon="calendar-outline"
            value={watch("fechaAnalisis")}
            onFocus={() => setShowDatePicker(true)}
            showSoftInputOnFocus={false}
            error={errors.fechaAnalisis?.message}
            style={[styles.input, styles.dateInput]}
          />
          {showDatePicker && (
            <DateTimePicker
              value={
                watch("fechaAnalisis")
                  ? new Date(
                      Number(watch("fechaAnalisis").split("-")[0]),
                      Number(watch("fechaAnalisis").split("-")[1]) - 1,
                      Number(watch("fechaAnalisis").split("-")[2])
                    )
                  : new Date()
              }
              mode="date"
              display="spinner"
              minimumDate={new Date(2000, 0, 1)}
              maximumDate={new Date(2100, 11, 31)}
              onChange={handleDateChange}
            />
          )}

          <ThemedPicker
            items={allCalidadSuelo}
            placeholder="Seleccione calidad del suelo"
            selectedValue={watch("calidadSuelo")}
            onValueChange={(text) => setValue("calidadSuelo", text)}
          />

          <ThemedPicker
            items={allTiposSuelo}
            placeholder="Seleccione tipo de suelo"
            selectedValue={watch("tipoSuelo")}
            onValueChange={(text) => setValue("tipoSuelo", text)}
          />

          <ThemedTextInput
            placeholder="Ingrese el rendimiento"
            keyboardType="numeric"
            value={watch("rendimiento")?.toString()}
            onChangeText={(text) => setValue("rendimiento", Number(text))}
            error={errors.rendimiento?.message}
            style={styles.input}
          />

          <ThemedTextInput
            placeholder="Ingrese la eficiencia"
            keyboardType="numeric"
            value={watch("eficienciaInsumos")?.toString()}
            onChangeText={(text) => setValue("eficienciaInsumos", Number(text))}
            error={errors.eficienciaInsumos?.message}
            style={styles.input}
          />

          <ThemedView style={styles.optionalFieldContainer}>
            <ThemedText>¿Desea agregar pH del suelo?</ThemedText>
            <Switch
              value={showPhField}
              onValueChange={(value) => {
                setShowPhField(value);
                if (!value) setValue("phSuelo", undefined);
              }}
            />
          </ThemedView>

          {showPhField && (
            <ThemedTextInput
              placeholder="Ingrese el pH (0-14)"
              keyboardType="numeric"
              value={watch("phSuelo")?.toString()}
              onChangeText={(text) =>
                setValue("phSuelo", text ? Number(text) : undefined)
              }
              error={errors.phSuelo?.message}
              style={styles.input}
            />
          )}

          <ThemedView style={styles.optionalFieldContainer}>
            <ThemedText>¿Desea agregar materia orgánica?</ThemedText>
            <Switch
              value={showMateriaOrganicaField}
              onValueChange={(value) => {
                setShowMateriaOrganicaField(value);
                if (!value) setValue("materiaOrganica", undefined);
              }}
            />
          </ThemedView>

          {showMateriaOrganicaField && (
            <ThemedTextInput
              placeholder="Ingrese el porcentaje"
              keyboardType="numeric"
              value={watch("materiaOrganica")?.toString()}
              onChangeText={(text) =>
                setValue("materiaOrganica", text ? Number(text) : undefined)
              }
              error={errors.materiaOrganica?.message}
              style={styles.input}
            />
          )}

          <ThemedView style={styles.optionalFieldContainer}>
            <ThemedText>¿Desea agregar observaciones?</ThemedText>
            <Switch
              value={showObservacionesField}
              onValueChange={(value) => {
                setShowObservacionesField(value);
                if (!value) setValue("observaciones", undefined);
              }}
            />
          </ThemedView>

          {showObservacionesField && (
            <ThemedTextInput
              placeholder="Ingrese observaciones"
              multiline
              numberOfLines={3}
              value={watch("observaciones")}
              onChangeText={(text) => setValue("observaciones", text)}
              error={errors.observaciones?.message}
              style={[styles.input, styles.textArea]}
            />
          )}

          <ThemedView
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <ThemedButton
              style={{ backgroundColor: "#979494" }}
              title="Cancelar"
              onPress={hideModal}
            />
            <ThemedButton
              title={
                editingAnalisis ? "Actualizar Análisis" : "Guardar Análisis"
              }
              onPress={handleSubmit(onSubmit)}
            />
          </ThemedView>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
    marginTop: 8,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateIcon: {
    marginLeft: 10,
  },
  input: {
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  optionalFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
});

export default ModalAgregarAnalisis;
