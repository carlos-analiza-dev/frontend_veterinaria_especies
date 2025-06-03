import { CrearPaises } from "@/core/paises/accions/crear-pais";
import { CreatePais } from "@/core/paises/interfaces/crear-pais.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Toast from "react-native-toast-message";

const CrearPaisPage = () => {
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<CreatePais>({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      code: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["crear-pais"],
    mutationFn: CrearPaises,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "País creado exitosamente",
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["paises"] });
      reset();
    },
    onError: (error) => {
      let errorMessage = "Ocurrió un error al crear el país";

      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;

        if (error.response?.data?.errors) {
          errorMessage = Object.values(error.response.data.errors)
            .flat()
            .join("\n");
        }
      }

      Toast.show({
        type: "error",
        text1: errorMessage,
        position: "bottom",
        visibilityTime: 4000,
      });
    },
  });

  const onSubmit = (data: CreatePais) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: height * 0.1 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.formContainer}>
          <ThemedText type="title" style={styles.title}>
            Crear Nuevo País
          </ThemedText>

          <Controller
            control={control}
            name="nombre"
            rules={{
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "Mínimo 3 caracteres",
              },
              maxLength: {
                value: 50,
                message: "Máximo 50 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Nombre del país"
                icon="globe-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre?.message}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="code"
            rules={{
              required: "El código es requerido",
              minLength: {
                value: 2,
                message: "Mínimo 2 caracteres",
              },
              maxLength: {
                value: 5,
                message: "Máximo 5 caracteres",
              },
              pattern: {
                value: /^[A-Z]+$/,
                message: "Solo letras mayúsculas",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Código (ej. US, MX)"
                icon="code-outline"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                onBlur={onBlur}
                error={errors.code?.message}
                autoCapitalize="characters"
                maxLength={5}
                returnKeyType="done"
              />
            )}
          />

          <ThemedButton
            icon="save-outline"
            title="Guardar País"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={!isValid || !isDirty || mutation.isPending}
            loading={mutation.isPending}
            style={styles.submitButton}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CrearPaisPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 22,
  },
  submitButton: {
    marginTop: 20,
  },
});
