import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface DeleteButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  confirmationMessage?: string;
  iconSize?: number;
  iconColor?: string;
  textColor?: string;
  buttonColor?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  onPress,
  style,
  disabled = false,
  confirmationMessage,
  iconSize = 20,
  iconColor = "#d32f2f",
  textColor = "#d32f2f",
  buttonColor = "#ffebee",
}) => {
  const handlePress = () => {
    if (confirmationMessage) {
      Alert.alert("Confirmar eliminación", confirmationMessage, [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress, style: "destructive" },
      ]);
    } else {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: buttonColor },
        style,
        disabled && styles.disabled,
      ]}
    >
      <MaterialIcons name="delete-outline" size={iconSize} color={iconColor} />
      <Text style={[styles.text, { color: textColor }]}>Eliminar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d32f2f",
  },
  text: {
    marginLeft: 8,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default DeleteButton;
