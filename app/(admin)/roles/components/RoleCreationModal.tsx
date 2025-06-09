import { CreateRolI } from "@/core/roles/interfaces/crear-rol.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  role: CreateRolI;
  onChange: (field: keyof CreateRolI, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  primaryColor: string;
}

const RoleCreationModal = ({
  isLoading,
  onChange,
  onDismiss,
  onSubmit,
  primaryColor,
  role,
  visible,
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ThemedView style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            Nuevo Rol
          </ThemedText>

          <TextInput
            label="Nombre del rol"
            value={role.name}
            onChangeText={(text) => onChange("name", text)}
            style={styles.input}
            mode="outlined"
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect={false}
          />

          <TextInput
            label="Descripción"
            value={role.description}
            onChangeText={(text) => onChange("description", text)}
            style={styles.input}
            mode="outlined"
          />

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
              onPress={onSubmit}
              style={styles.button}
              loading={isLoading}
              disabled={isLoading}
            >
              Guardar
            </Button>
          </View>
        </ThemedView>
      </Modal>
    </Portal>
  );
};

export default RoleCreationModal;

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
