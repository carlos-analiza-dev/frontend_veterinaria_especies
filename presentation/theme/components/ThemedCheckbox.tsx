import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  label: string;
  value: string;
  onPress: (alimento: string) => void;
  isSelected: boolean;
}

const ThemedCheckbox = ({ isSelected, label, onPress, value }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, isSelected && styles.checkboxSelected]}
      onPress={() => onPress(value)}
    >
      <View
        style={[styles.checkbox, isSelected && styles.checkboxInnerSelected]}
      >
        {isSelected && <View style={styles.checkboxMark} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxSelected: {
    borderColor: "#007AFF",
  },
  checkboxInnerSelected: {
    backgroundColor: "#007AFF",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  checkboxMark: {
    width: 12,
    height: 12,
    backgroundColor: "white",
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default ThemedCheckbox;
