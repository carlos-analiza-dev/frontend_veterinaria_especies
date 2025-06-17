import { ActualizarPaises } from "@/core/paises/accions/update-pais";
import { CreatePais } from "@/core/paises/interfaces/crear-pais.interface";
import usePaisesById from "@/hooks/paises/usePaisesById";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

type RoutePaisProps = RouteProp<UsersStackParamList, "PaisDetails">;

interface DetailsPaisProps {
  route: RoutePaisProps;
}

const PaisDetailsPage = ({ route }: DetailsPaisProps) => {
  const { paisId } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { data: pais, isLoading: cargando, isError } = usePaisesById(paisId);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<Partial<CreatePais>>();

  useEffect(() => {
    if (pais) {
      reset({
        nombre: pais.data.nombre,
        code: pais.data.code,
        code_phone: pais.data.code_phone,
        nombre_documento: pais.data.nombre_documento,
        nombre_moneda: pais.data.nombre_moneda,
        simbolo_moneda: pais.data.simbolo_moneda,
        isActive: pais.data.isActive,
      });
    }
  }, [pais, reset]);

  const mutation = useMutation({
    mutationKey: ["actualizar-pais"],
    mutationFn: (data: Partial<CreatePais>) => ActualizarPaises(paisId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "País actualizado exitosamente",
        position: "top",
      });
      queryClient.invalidateQueries({ queryKey: ["pais", paisId] });
      queryClient.invalidateQueries({ queryKey: ["paises"] });
      setIsEditing(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Error al actualizar el país",
          position: "bottom",
        });
      }
    },
  });

  const onSubmit = (data: Partial<CreatePais>) => {
    mutation.mutate(data);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      reset({
        nombre: pais?.data.nombre,
        code: pais?.data.code,
        code_phone: pais?.data.code_phone,
        nombre_documento: pais?.data.nombre_documento,
        nombre_moneda: pais?.data.nombre_moneda,
        simbolo_moneda: pais?.data.simbolo_moneda,
        isActive: pais?.data.isActive,
      });
    }
    setIsEditing(!isEditing);
  };

  if (cargando) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError || !pais) {
    return (
      <MessageError
        titulo="Error al cargar los datos del pais"
        descripcion=" No se encontraron datos del pais para este módulo. Por favor, verifica más tarde o vuelve a intentar."
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView
          style={[styles.card, { backgroundColor: colors.background }]}
        >
          <ThemedText type="title" style={styles.title}>
            {isEditing ? "Editar País" : "Detalles del País"}
          </ThemedText>

          <Controller
            control={control}
            name="nombre"
            rules={{ required: "Nombre es requerido" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Nombre del país"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre?.message}
                editable={isEditing}
              />
            )}
          />

          <Controller
            control={control}
            name="code"
            rules={{
              required: "Código es requerido",
              pattern: {
                value: /^[A-Z]{2,5}$/,
                message: "Código debe ser 2-5 letras mayúsculas",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Código del país (ej. CO)"
                value={value}
                onChangeText={(text) => onChange(text.toUpperCase())}
                onBlur={onBlur}
                error={errors.code?.message}
                editable={isEditing}
                maxLength={5}
              />
            )}
          />

          <Controller
            control={control}
            name="code_phone"
            rules={{
              required: "Código telefónico es requerido",
              pattern: {
                value: /^\+?\d{1,4}$/,
                message: "Código telefónico inválido (ej. +57)",
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Código telefónico (ej. +57)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.code_phone?.message}
                editable={isEditing}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="nombre_documento"
            rules={{ required: "Nombre del documento es requerido" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Nombre del documento (ej. DNI, Cédula)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre_documento?.message}
                editable={isEditing}
              />
            )}
          />

          <Controller
            control={control}
            name="nombre_moneda"
            rules={{ required: "Nombre de la moneda es requerido" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Nombre de la moneda (ej. Peso Colombiano)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nombre_moneda?.message}
                editable={isEditing}
              />
            )}
          />

          <Controller
            control={control}
            name="simbolo_moneda"
            rules={{ required: "Símbolo de la moneda es requerido" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ThemedTextInput
                placeholder="Símbolo de la moneda (ej. $)"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.simbolo_moneda?.message}
                editable={isEditing}
                maxLength={3}
              />
            )}
          />

          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>Activo:</ThemedText>
            <Switch
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value)}
              disabled={!isEditing}
              thumbColor={watch("isActive") ? "#4CAF50" : "#f44336"}
            />
          </View>

          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <ThemedButton
                  title="Guardar"
                  onPress={handleSubmit(onSubmit)}
                  loading={mutation.isPending}
                  disabled={!isDirty}
                />
                <ThemedButton
                  title="Cancelar"
                  onPress={handleEditToggle}
                  variant="outline"
                  style={styles.cancelButton}
                />
              </>
            ) : (
              <ThemedButton title="Editar" onPress={handleEditToggle} />
            )}
          </View>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PaisDetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    gap: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    marginTop: 8,
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  switchLabel: {
    fontSize: 16,
  },
});
