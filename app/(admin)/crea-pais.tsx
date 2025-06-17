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
  Switch,
  useWindowDimensions,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearPaisPage = () => {
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
  } = useForm<CreatePais>({
    mode: "onChange",
    defaultValues: {
      nombre: "",
      code: "",
      code_phone: "+",
      nombre_moneda: "",
      simbolo_moneda: "$",
      nombre_documento: "",
      isActive: true,
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
          { paddingTop: height * 0.05 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView
          style={[styles.formContainer, { backgroundColor: colors.background }]}
        >
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
                placeholder="Código ISO (ej. SV, GT, HN)"
                icon="code-outline"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                onBlur={onBlur}
                error={errors.code?.message}
                autoCapitalize="characters"
                maxLength={5}
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="code_phone"
            rules={{
              required: "El prefijo telefónico es requerido",
              pattern: {
                value: /^\+\d{1,4}$/,
                message: "Formato: + seguido de números (ej. +503)",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Prefijo telefónico (ej. +503)"
                icon="call-outline"
                value={value}
                onChangeText={(text) => {
                  if (!text.startsWith("+")) {
                    if (text.length > 0) {
                      text = "+" + text.replace(/\+/g, "");
                    } else {
                      text = "+";
                    }
                  }

                  onChange(text.replace(/[^0-9+]/g, ""));
                }}
                onBlur={onBlur}
                error={errors.code_phone?.message}
                keyboardType="phone-pad"
                maxLength={5}
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="nombre_moneda"
            rules={{
              required: "El nombre de la moneda es requerido",
              minLength: {
                value: 2,
                message: "Mínimo 2 caracteres",
              },
              maxLength: {
                value: 20,
                message: "Máximo 20 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Nombre de la moneda (ej. Dólar)"
                icon="cash-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre_moneda?.message}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="simbolo_moneda"
            rules={{
              required: "El símbolo de la moneda es requerido",
              maxLength: {
                value: 3,
                message: "Máximo 3 caracteres",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Símbolo (ej. $, €)"
                icon="pricetag-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.simbolo_moneda?.message}
                maxLength={3}
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="nombre_documento"
            rules={{
              required: "El tipo de documento es requerido",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <ThemedTextInput
                placeholder="Documento ejm: (DNI,DUI,DPI)"
                icon="document-text-outline"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre_documento?.message}
                maxLength={3}
                returnKeyType="next"
              />
            )}
          />

          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>País Activo</ThemedText>
            <Switch
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value)}
              thumbColor={watch("isActive") ? "#4CAF50" : "#f44336"}
            />
          </View>

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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});
