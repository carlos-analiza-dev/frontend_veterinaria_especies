import { ActualizarAnimal } from "@/core/animales/accions/update-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { sexoOptions } from "@/helpers/data/sexo_animales";
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
import { ActivityIndicator, Switch, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

type RouteAnimalProps = RouteProp<UsersStackParamList, "AnimalDetails">;

interface EditarAnimalProps {
  route: RouteAnimalProps;
}

const AnimalDetailsPage = ({ route }: EditarAnimalProps) => {
  const { animalId } = route.params;
  const { user } = useAuthStore();
  const userId = user?.id;
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
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
  } = useForm<Partial<CrearAnimalByFinca>>();

  const { data: animalData } = useAnimalById(animalId);

  useEffect(() => {
    if (animalData?.data) {
      const animal = animalData.data;
      reset({
        especie: animal?.especie?.id || "",
        sexo: animal?.sexo || "",
        color: animal?.color || "",
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

    const animalData = {
      ...data,
      propietarioId: userId,
    };

    mutation.mutate(animalData);
  };

  if (!animalData?.data) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator />
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
                icon="code-outline"
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
                placeholder="Identificador (ej: BOSE2-000001)"
                icon="alert-outline"
                value={watch("identificador")}
                onChangeText={(text) => setValue("identificador", text)}
                error={errors.identificador?.message}
                style={styles.input}
              />

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
                icon="bug-outline"
                error={errors.raza?.message}
              />
              <ThemedTextInput
                placeholder="Edad promedio (años)"
                icon="calendar-number-outline"
                value={watch("edad_promedio")?.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  setValue("edad_promedio", num);
                }}
                keyboardType="numeric"
                error={errors.edad_promedio?.message}
                style={styles.input}
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

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Castrado</Text>
                <Switch
                  value={watch("castrado") || false}
                  onValueChange={(value) => setValue("castrado", value)}
                  color={colors.primary}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Esterilizado</Text>
                <Switch
                  value={watch("esterelizado") || false}
                  onValueChange={(value) => setValue("esterelizado", value)}
                  color={colors.primary}
                />
              </View>

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
});

export default AnimalDetailsPage;
