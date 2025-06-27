import { AddServicio } from "@/core/servicios/accions/crear-servicio";
import { CrearServicio } from "@/core/servicios/interfaces/crear-servicio.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  HelperText,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddService = ({ visible, setVisible }: Props) => {
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    minHeight: 300,
  };
  const queryClient = useQueryClient();
  const primary = useThemeColor({}, "primary");
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CrearServicio>({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CrearServicio) => AddServicio(data),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Categoria Creada Exitosamente" });
      reset();
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      setVisible(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al crear la categoria";

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

  const onSubmit = (data: CrearServicio) => {
    mutation.mutate(data);
  };

  const hideModal = () => {
    setVisible(false);
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
                label="Nombre Categoria"
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
                Agregar
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

export default ModalAddService;
