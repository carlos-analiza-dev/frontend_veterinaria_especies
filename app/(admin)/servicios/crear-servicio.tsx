import { AddServicio } from "@/core/servicios/accions/crear-servicio";
import { CrearServicio } from "@/core/servicios/interfaces/crear-servicio.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearServicioPage = () => {
  const queryClient = useQueryClient();
  const primary = useThemeColor({}, "primary");
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<CrearServicio>({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CrearServicio) => AddServicio(data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Servicio Creado Exitosamente" });
      reset();
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de crear el servicio",
        });
      }
    },
  });

  const onSubmit = (data: CrearServicio) => {
    mutation.mutate(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Nombre del Servicio"
        mode="outlined"
        style={styles.input}
        onChangeText={(text) => setValue("nombre", text)}
        error={!!errors.nombre}
      />
      {errors.nombre && (
        <HelperText type="error" visible={!!errors.nombre}>
          {errors.nombre.message}
        </HelperText>
      )}

      <TextInput
        label="Descripción"
        mode="outlined"
        style={[styles.input, styles.multilineInput]}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setValue("descripcion", text)}
        error={!!errors.descripcion}
      />
      {errors.descripcion && (
        <HelperText type="error" visible={!!errors.descripcion}>
          {errors.descripcion.message}
        </HelperText>
      )}

      {mutation.isPending ? (
        <ActivityIndicator animating={true} style={styles.loader} />
      ) : (
        <Button
          buttonColor={primary}
          mode="contained"
          icon="plus"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          disabled={!isValid || mutation.isPending}
        >
          Crear Servicio
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  input: {
    marginBottom: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  loader: {
    marginTop: 20,
  },
});

export default CrearServicioPage;
