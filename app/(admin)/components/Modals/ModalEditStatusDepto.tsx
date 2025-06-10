import { Departamento } from "@/core/departamentos/interfaces/response-departamentos.interface";
import React from "react";
import { View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

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
  const { colors } = useTheme();
  return (
    <Portal>
      <Modal
        visible={visibleModalDelete}
        onDismiss={hiddenModalDelete}
        contentContainerStyle={{
          padding: 20,
          margin: 20,
          borderRadius: 8,
          backgroundColor: colors.background,
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
