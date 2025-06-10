import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/useAuthStore";

const LogoutIconButton = () => {
  const themeColors = {
    primary: useThemeColor({}, "primary"),
    text: useThemeColor({}, "text"),
    background: useThemeColor({}, "background"),
    card:
      useThemeColor({}, "card") ||
      (Colors.dark.background === useThemeColor({}, "background")
        ? "#2A3A5A"
        : "#FFFFFF"),
    danger: useThemeColor({}, "danger") || "#FF4444",
    tabIconDefault: useThemeColor({}, "tabIconDefault") || "#9BA1A6",
  };

  const { logout } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setShowModal(false);

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }, [logout]);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        style={{ marginRight: 8 }}
        testID="logout-button"
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color={themeColors.primary} />
        ) : (
          <Ionicons
            name="log-out-outline"
            size={24}
            color={themeColors.primary}
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.6)" },
          ]}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: themeColors.card },
            ]}
          >
            <Ionicons
              name="warning-outline"
              size={40}
              color={themeColors.danger}
              style={styles.warningIcon}
            />
            <Text style={[styles.modalTitle, { color: themeColors.text }]}>
              ¿Cerrar sesión?
            </Text>
            <Text style={[styles.modalText, { color: themeColors.text }]}>
              ¿Estás seguro que deseas salir de tu cuenta?
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: themeColors.tabIconDefault },
                ]}
                onPress={closeModal}
                disabled={isLoggingOut}
                testID="cancel-button"
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: themeColors.danger }]}
                onPress={handleLogout}
                disabled={isLoggingOut}
                testID="confirm-button"
              >
                {isLoggingOut ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Salir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  warningIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default LogoutIconButton;
