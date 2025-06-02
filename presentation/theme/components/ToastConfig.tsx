import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export const toastConfig = {
  success: ({ text1, props }: any) => (
    <View style={styles.successContainer}>
      <Ionicons name="checkmark-circle" size={24} color="white" />
      <Text style={styles.successText}>{text1}</Text>
    </View>
  ),
  error: ({ text1, props }: any) => (
    <View style={styles.errorContainer}>
      <Ionicons name="close-circle" size={24} color="white" />
      <Text style={styles.errorText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    width: "90%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 8,
    width: "90%",
  },
  successText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  errorText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
});
