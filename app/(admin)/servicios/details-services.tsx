import { EditarServicio } from "@/core/servicios/accions/editar-servicio";
import { ObtenerServicioId } from "@/core/servicios/accions/obtener-serviciobyId";
import { CrearServicio } from "@/core/servicios/interfaces/crear-servicio.interface";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

type RouteServicioProps = RouteProp<UsersStackParamList, "DetailsServicio">;

interface DetailsServicioProps {
  route: RouteServicioProps;
}

const DetailsServices = ({ route }: DetailsServicioProps) => {
  const primary = useThemeColor({}, "primary");
  const queryClient = useQueryClient();
  const { servicioId } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<CrearServicio>();

  const {
    data: servicioResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["servicio-id", servicioId],
    queryFn: () => ObtenerServicioId(servicioId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });

  const servicio = servicioResponse?.data;

  React.useEffect(() => {
    if (servicio) {
      setValue("nombre", servicio.nombre);
      setValue("descripcion", servicio.descripcion);
    }
  }, [servicio, setValue]);

  const mutation = useMutation({
    mutationFn: (data: CrearServicio) => EditarServicio(servicioId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Servicio actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      queryClient.invalidateQueries({ queryKey: ["servicio-id"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          Toast.show({
            type: "error",
            text1: messages.join("\n"),
          });
        } else if (typeof messages === "string") {
          Toast.show({
            type: "error",
            text1: messages,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error al actualizar el servicio",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado al actualizar el servicio",
        });
      }
    },
  });

  const onSubmit = (data: CrearServicio) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !servicio) {
    return (
      <MessageError
        titulo="Error al cargar los datos del servicio"
        descripcion=" No se encontraron datos del servicio en este módulo. Por favor, verifica más tarde o vuelve a intentar."
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Controller
        control={control}
        name="nombre"
        rules={{ required: "El nombre es requerido" }}
        render={({ field }) => (
          <TextInput
            label="Nombre del Servicio"
            mode="outlined"
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.nombre}
          />
        )}
      />
      {errors.nombre && (
        <HelperText type="error" visible={!!errors.nombre}>
          {errors.nombre.message}
        </HelperText>
      )}

      <Controller
        control={control}
        name="descripcion"
        rules={{ required: "La descripción es requerida" }}
        render={({ field }) => (
          <TextInput
            label="Descripción"
            mode="outlined"
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={4}
            value={field.value}
            onChangeText={field.onChange}
            error={!!errors.descripcion}
          />
        )}
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
          mode="contained"
          buttonColor={primary}
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          disabled={!isValid || mutation.isPending}
        >
          Actualizar Servicio
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20,
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

export default DetailsServices;
