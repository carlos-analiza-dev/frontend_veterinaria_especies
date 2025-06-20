import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";

interface TokenExpiredModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export const TokenExpiredModal = ({
  visible,
  onConfirm,
}: TokenExpiredModalProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onConfirm}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <MaterialIcons
            name="warning"
            size={48}
            color="#E53935"
            style={styles.icon}
          />
          <Text variant="titleLarge" style={styles.title}>
            ¡Sesión expirada!
          </Text>
          <Text variant="bodyMedium" style={styles.message}>
            Tu sesión ha caducado por inactividad. Por favor, vuelve a iniciar
            sesión.
          </Text>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.button}
            buttonColor="#E53935"
            textColor="#fff"
          >
            Volver al inicio
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 28,
    marginHorizontal: 20,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
    color: "#E53935",
  },
  message: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 6,
  },
});
