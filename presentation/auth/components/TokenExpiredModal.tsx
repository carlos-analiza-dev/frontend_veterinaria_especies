import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";

interface TokenExpiredModalProps {
  visible: boolean;
  onConfirm: () => void;
}

export const TokenExpiredModal = ({
  visible,
  onConfirm,
}: TokenExpiredModalProps) => {
  const theme = useTheme();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onConfirm}
        contentContainerStyle={styles.modalContainer}
        theme={{ colors: { backdrop: "rgba(0, 0, 0, 0.5)" } }}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
          accessibilityLabel="Sesión expirada"
          accessibilityHint="Tu sesión ha caducado por inactividad. Por favor, vuelve a iniciar sesión."
          accessibilityRole="alert"
        >
          <MaterialIcons
            name="warning"
            size={56}
            color={theme.colors.error}
            style={styles.icon}
            accessibilityElementsHidden
          />
          <Text
            variant="headlineSmall"
            style={[styles.title, { color: theme.colors.error }]}
            accessibilityRole="header"
          >
            ¡Sesión expirada!
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.message, { color: theme.colors.onSurface }]}
          >
            Tu sesión ha caducado por inactividad. Por favor, vuelve a iniciar
            sesión para continuar.
          </Text>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.button}
            buttonColor={theme.colors.error}
            textColor="#fff"
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            accessibilityLabel="Volver al inicio de sesión"
            accessibilityHint="Presiona para regresar a la pantalla de inicio de sesión"
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
    padding: 16,
  },
  modalContent: {
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
  },
  message: {
    marginBottom: 28,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  button: {
    width: "100%",
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});
