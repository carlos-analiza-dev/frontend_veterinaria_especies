import { Departamento } from "@/core/departamentos/interfaces/response-departamentos.interface";
import React from "react";
import { View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

interface Props {
  visibleModalDelete: boolean;
  hiddenModalDelete: () => void;
  deptoToDelete: Departamento | null;
  handleConfirmUpdateStatus: () => Promise<void>;
}

const ModalDeleteDepto = ({
  deptoToDelete,
  handleConfirmUpdateStatus,
  hiddenModalDelete,
  visibleModalDelete,
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={visibleModalDelete}
        onDismiss={hiddenModalDelete}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 8,
        }}
      >
        <Text variant="titleLarge">Confirmar actualizacion</Text>
        <Text style={{ marginVertical: 15 }}>
          ¿Estás seguro que deseas actualizar el estado del departamento "
          {deptoToDelete?.nombre}"?
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <Button
            mode="outlined"
            onPress={hiddenModalDelete}
            style={{ marginRight: 10 }}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleConfirmUpdateStatus}
            buttonColor="#ff4444"
          >
            Continuar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalDeleteDepto;
