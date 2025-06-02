import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

const LogoutIconButton = () => {
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor =
    useThemeColor({}, "card") ||
    (Colors.dark.background === backgroundColor ? "#2A3A5A" : "#FFFFFF");
  const dangerColor = useThemeColor({}, "danger") || "#FF4444";
  const cancelButtonColor = useThemeColor({}, "tabIconDefault") || "#9BA1A6";

  const { logout } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(false);
    logout();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={{ marginRight: 8 }}
        testID="logout-button"
      >
        <Ionicons name="log-out-outline" size={24} color={primaryColor} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.6)" },
          ]}
        >
          <View style={[styles.modalContainer, { backgroundColor: cardColor }]}>
            <Ionicons
              name="warning-outline"
              size={40}
              color={dangerColor}
              style={styles.warningIcon}
            />
            <Text style={[styles.modalTitle, { color: textColor }]}>
              ¿Cerrar sesión?
            </Text>
            <Text style={[styles.modalText, { color: textColor }]}>
              ¿Estás seguro que deseas salir de tu cuenta?
            </Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: cancelButtonColor }]}
                onPress={() => setShowModal(false)}
                testID="cancel-button"
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: dangerColor }]}
                onPress={handleLogout}
                testID="confirm-button"
              >
                <Text style={styles.buttonText}>Salir</Text>
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
