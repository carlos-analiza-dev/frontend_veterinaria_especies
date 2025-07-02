import { EditarServicio } from "@/core/servicios/accions/editar-servicio";
import { CrearServicio } from "@/core/servicios/interfaces/crear-servicio.interface";
import useServicioById from "@/hooks/servicios/useServicioById";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  Card,
  HelperText,
  Modal,
  Portal,
  Switch,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  hideModal: () => void;
  servicioId: string;
}

const ModalEditService = ({ hideModal, visible, servicioId }: Props) => {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    minHeight: 300,
  };
  const primary = useThemeColor({}, "primary");
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },

    setValue,
  } = useForm<CrearServicio>();

  const { data: servicioResponse } = useServicioById(servicioId);

  const servicio = servicioResponse?.data;

  React.useEffect(() => {
    if (servicio) {
      setValue("nombre", servicio.nombre);
      setValue("descripcion", servicio.descripcion);
      setValue("isActive", servicio.isActive);
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
      hideModal();
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
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={containerStyle}
      >
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

          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, value } }) => (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Estado:</Text>
                <Switch
                  value={value}
                  onValueChange={onChange}
                  color={primary}
                />
                <Text style={styles.switchText}>
                  {value ? "Activo" : "Inactivo"}
                </Text>
              </View>
            )}
          />

          {mutation.isPending ? (
            <ActivityIndicator animating={true} style={styles.loader} />
          ) : (
            <Card.Actions style={{ justifyContent: "space-between" }}>
              <Button
                mode="outlined"
                onPress={hideModal}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                buttonColor={primary}
                onPress={handleSubmit(onSubmit)}
                style={{ flex: 1, marginLeft: 8 }}
                disabled={!isValid || mutation.isPending}
              >
                Editar
              </Button>
            </Card.Actions>
          )}
        </ScrollView>
      </Modal>
    </Portal>
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  switchText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ModalEditService;
