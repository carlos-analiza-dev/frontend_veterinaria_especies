import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const TimePickerButton = ({
  label,
  time,
  onPress,
  colors,
}: {
  label: string;
  time: string;
  onPress: () => void;
  colors: any;
}) => {
  const buttonStyles = StyleSheet.create({
    container: {
      width: "48%",
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: colors.text,
    },
    content: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.text + "40",
    },
    text: {
      fontSize: 16,
    },
  });

  return (
    <View style={buttonStyles.container}>
      <Text style={buttonStyles.label}>{label}</Text>
      <TouchableOpacity onPress={onPress} style={buttonStyles.content}>
        <Text style={[buttonStyles.text, { color: colors.text }]}>{time}</Text>
        <FontAwesome name="clock-o" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};
