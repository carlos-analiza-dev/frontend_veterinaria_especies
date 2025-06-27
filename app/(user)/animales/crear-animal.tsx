import { CreateAnimal } from "@/core/animales/accions/crear-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { Switch, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearAnimal = () => {
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [alimentosSeleccionados, setAlimentosSeleccionados] = useState<
    string[]
  >([]);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CrearAnimalByFinca & { identificador_temp: string }>();

  const { data: especies } = useGetEspecies();
  const especieId = watch("especie");
  const { data: razas } = useGetRazasByEspecie(especieId);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      const localDate = new Date(selectedDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setValue("fecha_nacimiento", formatted);
    }
  };

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");

  const especiesItmes =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
  }));

  const selectedSexo = watch("sexo");

  useEffect(() => {
    if (selectedSexo === "Macho") {
      setValue("esterelizado", false);
    } else if (selectedSexo === "Hembra") {
      setValue("castrado", false);
    }
  }, [selectedSexo, setValue]);

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const handleAlimentoChange = (alimento: string) => {
    const nuevosAlimentos = [...alimentosSeleccionados];
    if (nuevosAlimentos.includes(alimento)) {
      const index = nuevosAlimentos.indexOf(alimento);
      nuevosAlimentos.splice(index, 1);
    } else {
      nuevosAlimentos.push(alimento);
    }
    setAlimentosSeleccionados(nuevosAlimentos);
    setValue(
      "tipo_alimentacion",
      nuevosAlimentos.map((a) => ({ alimento: a }))
    );
  };

  const getIdentifierPrefix = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const raza = razas?.data.find((r) => r.id === watch("raza"));
    const sexo = watch("sexo");

    if (!especie || !raza || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();
    const razaCode = raza.abreviatura.toUpperCase();
    const sexoCode = sexo === "Macho" ? "1" : "2";

    return `${especieCode}${razaCode}${sexoCode}`;
  };

  const formatNumber = (num: string) => {
    return num.padStart(6, "0");
  };

  const handleIdentifierChange = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);

    setValue("identificador_temp", numbersOnly);

    const prefix = getIdentifierPrefix();
    if (prefix && numbersOnly.length === 6) {
      setValue("identificador", `${prefix}-${formatNumber(numbersOnly)}`);
    }
  };

  useEffect(() => {
    const prefix = getIdentifierPrefix();
    const currentNumber = watch("identificador_temp");

    if (prefix && currentNumber?.length === 6) {
      setValue("identificador", `${prefix}-${formatNumber(currentNumber)}`);
    }
  }, [
    watch("especie"),
    watch("raza"),
    watch("sexo"),
    watch("identificador_temp"),
  ]);

  const mutation = useMutation({
    mutationFn: (data: CrearAnimalByFinca) => CreateAnimal(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Animal creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      setAlimentosSeleccionados([]);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: messages.join("\n"),
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: messages || "No se pudo crear el animal",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Ocurrió un error inesperado",
        });
      }
    },
  });

  const onSubmit = (data: CrearAnimalByFinca) => {
    if (!user?.id) return;

    if (!data.especie) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar una especie",
      });
      return;
    }

    if (!data.raza) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar una raza",
      });
      return;
    }

    if (!data.sexo) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar un sexo",
      });
      return;
    }

    if (
      !data.identificador ||
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,4}[12]-\d{6}$/.test(data.identificador)
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El identificador debe tener 6 dígitos",
      });
      return;
    }

    const animalData = {
      ...data,
      propietarioId: user.id,
    };

    delete (animalData as any).identificador_temp;

    mutation.mutate(animalData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { minHeight: height * 0.8 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.formContainer, { width: width * 0.9 }]}>
              <ThemedPicker
                items={especiesItmes}
                onValueChange={(value) => setValue("especie", value)}
                selectedValue={watch("especie")}
                placeholder="Selecciona una especie"
                icon="paw-outline"
                error={errors.especie?.message}
              />

              <ThemedPicker
                items={sexoItems}
                onValueChange={(value) => setValue("sexo", value)}
                selectedValue={watch("sexo")}
                placeholder="Selecciona un sexo"
                icon="transgender-outline"
                error={errors.sexo?.message}
              />

              <ThemedTextInput
                placeholder="Color del animal"
                icon="color-palette-outline"
                value={watch("color")}
                onChangeText={(text) => setValue("color", text)}
                error={errors.color?.message}
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Ingrese 6 dígitos"
                icon="warning-outline"
                value={watch("identificador_temp") || ""}
                onChangeText={handleIdentifierChange}
                onFocus={() => setShowIdentifierHelp(true)}
                onBlur={() => setShowIdentifierHelp(false)}
                error={errors.identificador?.message}
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
              />

              {showIdentifierHelp && (
                <Text style={styles.helpText}>
                  PRIMEROS SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
                </Text>
              )}

              <ThemedPicker
                items={
                  razas?.data.map((raza) => ({
                    label: raza.nombre,
                    value: raza.id,
                  })) || []
                }
                onValueChange={(value) => setValue("raza", value)}
                selectedValue={watch("raza")}
                placeholder="Selecciona una raza"
                icon="git-branch-outline"
                error={errors.raza?.message}
              />

              <ThemedTextInput
                placeholder="Fecha de nacimiento"
                icon="calendar-outline"
                value={watch("fecha_nacimiento")}
                onFocus={() => setShowDatePicker(true)}
                showSoftInputOnFocus={false}
                error={errors.fecha_nacimiento?.message}
                style={styles.input}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={
                    watch("fecha_nacimiento")
                      ? new Date(
                          Number(watch("fecha_nacimiento").split("-")[0]),
                          Number(watch("fecha_nacimiento").split("-")[1]) - 1,
                          Number(watch("fecha_nacimiento").split("-")[2])
                        )
                      : new Date()
                  }
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
              )}

              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Tipo de alimentación</Text>
                {alimentosOptions.map((alimento) => (
                  <ThemedCheckbox
                    key={alimento.value}
                    label={alimento.label}
                    value={alimento.value}
                    onPress={handleAlimentoChange}
                    isSelected={alimentosSeleccionados.includes(alimento.value)}
                  />
                ))}
                {errors.tipo_alimentacion?.message && (
                  <Text style={styles.errorText}>
                    {errors.tipo_alimentacion.message}
                  </Text>
                )}
              </View>

              {selectedSexo === "Macho" && (
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Castrado</Text>
                  <Switch
                    value={watch("castrado") || false}
                    onValueChange={(value) => setValue("castrado", value)}
                    color={colors.primary}
                  />
                </View>
              )}

              {selectedSexo === "Hembra" && (
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>Esterilizado</Text>
                  <Switch
                    value={watch("esterelizado") || false}
                    onValueChange={(value) => setValue("esterelizado", value)}
                    color={colors.primary}
                  />
                </View>
              )}

              <ThemedTextInput
                placeholder="Caracteristicas"
                icon="clipboard-outline"
                value={watch("observaciones")}
                onChangeText={(text) => setValue("observaciones", text)}
                error={errors.observaciones?.message}
                style={[styles.input, styles.multilineInput]}
              />

              <ThemedPicker
                items={fincasItems}
                onValueChange={(value) => setValue("fincaId", value)}
                selectedValue={watch("fincaId")}
                placeholder="Selecciona una finca"
                icon="podium-outline"
                error={errors.fincaId?.message}
              />

              <ThemedButton
                title="Crear Animal"
                onPress={handleSubmit(onSubmit)}
                icon="arrow-forward-outline"
                loading={mutation.isPending}
                style={styles.submitButton}
              />
            </View>
          </ScrollView>
        </ThemedView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  formContainer: {
    maxWidth: 500,
    alignSelf: "center",
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  datePicker: {
    width: "100%",
    marginBottom: 15,
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  identifierPreview: {
    marginBottom: 15,
    color: "#666",
    fontSize: 14,
  },
  helpText: {
    color: "#e63946",
    fontSize: 12,
    marginBottom: 10,
    fontStyle: "italic",
  },
});

export default CrearAnimal;
