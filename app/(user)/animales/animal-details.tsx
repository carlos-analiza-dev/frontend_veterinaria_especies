import { ActualizarAnimal } from "@/core/animales/accions/update-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { extractNumberFromIdentifier } from "@/helpers/funciones/extractNumberFromIdentifier ";
import useAnimalById from "@/hooks/animales/useAnimalById";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
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

type RouteAnimalProps = RouteProp<UsersStackParamList, "AnimalDetails">;

interface EditarAnimalProps {
  route: RouteAnimalProps;
}

const AnimalDetailsPage = ({ route }: EditarAnimalProps) => {
  const { animalId } = route.params;
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const userId = user?.id;
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [especieId, setEspecieId] = useState("");
  const [alimentosSeleccionados, setAlimentosSeleccionados] = useState<
    string[]
  >([]);

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Partial<CrearAnimalByFinca & { identificador_temp: string }>>();

  const { data: animalData } = useAnimalById(animalId);

  useEffect(() => {
    if (animalData?.data) {
      const animal = animalData.data;
      reset({
        especie: animal?.especie?.id || "",
        sexo: animal?.sexo || "",
        color: animal?.color || "",
        identificador_temp: extractNumberFromIdentifier(animal?.identificador),
        identificador: animal?.identificador || "",
        raza: animal?.raza?.id || "",
        edad_promedio: Number(animal?.edad_promedio) || 0,
        fecha_nacimiento: animal?.fecha_nacimiento || "",
        castrado: animal?.castrado || false,
        esterelizado: animal?.esterelizado || false,
        observaciones: animal?.observaciones || "",
        fincaId: animal?.finca?.id || "",
        propietarioId: animal?.propietario?.id || "",
      });

      if (animal?.tipo_alimentacion) {
        const alimentos = animal.tipo_alimentacion.map((a) => a.alimento);
        setAlimentosSeleccionados(alimentos);
      }
    }
  }, [animalData, reset]);

  const { data: especies } = useGetEspecies();

  useEffect(() => {
    if (animalData?.data) {
      setEspecieId(animalData.data.especie.id);
    }
  }, [animalData]);

  const { data: razas } = useGetRazasByEspecie(especieId);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("fecha_nacimiento", selectedDate.toISOString().split("T")[0]);
    }
  };

  const { data: fincas } = useFincasPropietarios(userId ?? "");

  const especiesItems =
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

    if (!especie || !raza || !sexo) {
      const currentId = watch("identificador");
      if (currentId) {
        const match = currentId.match(/^([A-Z]{2}[A-Z]{3,4}[12])-/);
        return match ? match[1] : null;
      }
      return null;
    }

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
      setValue("identificador", `${prefix}-${numbersOnly}`);
    }
  };

  useEffect(() => {
    const prefix = getIdentifierPrefix();
    const currentNumber = watch("identificador_temp");

    if (prefix && currentNumber?.length === 6) {
      setValue("identificador", `${prefix}-${formatNumber(currentNumber)}`);
    } else if (!currentNumber && watch("identificador")) {
      setValue("identificador", watch("identificador"));
    }
  }, [
    watch("especie"),
    watch("raza"),
    watch("sexo"),
    watch("identificador_temp"),
    watch("identificador"),
  ]);

  const mutation = useMutation({
    mutationFn: (data: Partial<CrearAnimalByFinca>) =>
      ActualizarAnimal(animalId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Animal actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["animal-id", animalId] });
      navigation.goBack();
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
            text2: messages || "No se pudo actualizar el animal",
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

  const onSubmit = (data: Partial<CrearAnimalByFinca>) => {
    if (!userId) return;

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
      data.identificador &&
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,4}[12]-\d{6}$/.test(data.identificador)
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El identificador debe tener el formato correcto",
      });
      return;
    }

    const animalData = {
      ...data,
      propietarioId: userId,
    };

    delete (animalData as any).identificador_temp;

    mutation.mutate(animalData);
  };

  if (!animalData?.data) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

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
                items={especiesItems}
                onValueChange={(value) => {
                  setValue("especie", value);
                  setValue("raza", "");
                  setEspecieId(value);
                }}
                selectedValue={watch("especie") || ""}
                placeholder="Selecciona una especie"
                icon="paw-outline"
                error={errors.especie?.message}
              />

              <ThemedPicker
                items={sexoItems}
                onValueChange={(value) => setValue("sexo", value)}
                selectedValue={watch("sexo") || ""}
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
                onFocus={() => setShowIdentifierHelp(true)}
                onBlur={() => setShowIdentifierHelp(false)}
                value={watch("identificador_temp") || ""}
                onChangeText={handleIdentifierChange}
                error={
                  watch("especie") && watch("raza") && watch("sexo")
                    ? errors.identificador?.message
                    : undefined
                }
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
              />

              {showIdentifierHelp && (
                <Text style={styles.helpText}>
                  NÚMERO DE SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
                </Text>
              )}

              <ThemedPicker
                items={
                  razas && razas.data
                    ? razas.data.map((raza) => ({
                        label: raza.nombre,
                        value: raza.id,
                      }))
                    : []
                }
                onValueChange={(value) => setValue("raza", value)}
                selectedValue={watch("raza") || ""}
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
                          watch("fecha_nacimiento") || new Date().toISOString()
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
                placeholder="Observaciones"
                icon="clipboard-outline"
                value={watch("observaciones")}
                onChangeText={(text) => setValue("observaciones", text)}
                error={errors.observaciones?.message}
                style={[styles.input, styles.multilineInput]}
              />

              <ThemedPicker
                items={fincasItems}
                onValueChange={(value) => setValue("fincaId", value)}
                selectedValue={watch("fincaId") || ""}
                placeholder="Selecciona una finca"
                icon="podium-outline"
                error={errors.fincaId?.message}
              />

              <ThemedButton
                title="Actualizar Animal"
                onPress={handleSubmit(onSubmit)}
                icon="save-outline"
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

export default AnimalDetailsPage;
