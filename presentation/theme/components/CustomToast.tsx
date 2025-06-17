import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  text1?: string;
  text2?: string;
  props?: any;
}

export const CustomToast = ({ text1, text2 }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text1}>{text1}</Text>
      {text2 && <Text style={styles.text2}>{text2}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text1: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  text2: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
});
