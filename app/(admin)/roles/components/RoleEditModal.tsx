import { UpdateRol } from "@/core/roles/accions/update-rol";
import { ResponseRoles } from "@/core/roles/interfaces/response-roles.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Switch,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  roles: ResponseRoles | null;
  onUpdateSuccess: () => void;
  primaryColor: string;
}

const RoleEditModal = ({
  visible,
  onDismiss,
  onUpdateSuccess,
  roles,
  primaryColor,
}: Props) => {
  const { colors } = useTheme();
  const [rolName, setRolName] = useState("");
  const [rolDescription, setRolDescription] = useState("");
  const [activo, setActivo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (roles) {
      setRolName(roles.name);
      setRolDescription(roles.description);
      setActivo(roles.isActive);
    }
  }, [roles]);

  const handleSubmit = async () => {
    if (!roles) return;

    if (!rolName.trim() || !rolDescription.trim()) {
      Toast.show({
        type: "error",
        text1: "Campos requeridos",
        text2: "Nombre y descripción son obligatorios",
      });
      return;
    }

    setIsLoading(true);
    try {
      await UpdateRol(roles.id, {
        name: rolName,
        description: rolDescription,
        isActive: activo,
      });

      Toast.show({
        type: "success",
        text1: "Rol actualizado",
        text2: "Los cambios se guardaron correctamente",
      });
      onUpdateSuccess();
      onDismiss();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar",
        text2: "No se pudieron guardar los cambios",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ThemedView
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <ThemedText type="title" style={styles.modalTitle}>
            Editar Rol
          </ThemedText>

          <TextInput
            label="Nombre del rol"
            value={rolName}
            onChangeText={setRolName}
            style={styles.input}
            mode="outlined"
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect={false}
          />

          <TextInput
            label="Descripción"
            value={rolDescription}
            onChangeText={setRolDescription}
            style={styles.input}
            mode="outlined"
          />

          <View style={styles.switchContainer}>
            <ThemedText>Estado: </ThemedText>
            <Switch
              value={activo}
              onValueChange={setActivo}
              color={primaryColor}
            />
            <ThemedText>{activo ? "Activo" : "Inactivo"}</ThemedText>
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={onDismiss}
              style={styles.button}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              buttonColor={primaryColor}
              onPress={handleSubmit}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Editar
            </Button>
          </View>
        </ThemedView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});

export default RoleEditModal;
