import { ActualizarDepto } from "@/core/departamentos/accions/update-depto";
import { Departamento } from "@/core/departamentos/interfaces/response-departamentos.interface";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface ModalEditDeptoProps {
  visible: boolean;
  onDismiss: () => void;
  departamento: Departamento | null;
  onUpdateSuccess: () => void;
}

const ModalEditDepto: React.FC<ModalEditDeptoProps> = ({
  visible,
  onDismiss,
  departamento,
  onUpdateSuccess,
}) => {
  const { colors } = useTheme();
  const [nombre, setNombre] = useState(departamento?.nombre || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (departamento) {
      setNombre(departamento.nombre);
    }
  }, [departamento]);

  const handleSubmit = async () => {
    if (!nombre.trim()) {
      setError("El nombre del departamento es requerido");
      return;
    }

    if (!departamento) return;

    setIsLoading(true);
    try {
      await ActualizarDepto(departamento.id, { nombre });

      Toast.show({
        type: "success",
        text1: "Departamento actualizado exitosamente",
      });

      onUpdateSuccess();
      onDismiss();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar el departamento",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={{
        padding: 20,
        margin: 20,
        borderRadius: 8,
        backgroundColor: colors.background,
      }}
    >
      <Text variant="titleLarge">Editar Departamento</Text>

      <TextInput
        label="Nombre del Departamento"
        value={nombre}
        onChangeText={(text) => {
          setNombre(text);
          setError("");
        }}
        mode="outlined"
        style={{ marginTop: 15 }}
        error={!!error}
      />
      {error && <HelperText type="error">{error}</HelperText>}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <Button
          mode="outlined"
          onPress={onDismiss}
          style={{ marginRight: 10 }}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
        >
          Guardar
        </Button>
      </View>
    </Modal>
  );
};

export default ModalEditDepto;
