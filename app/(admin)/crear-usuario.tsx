import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import FormCreateUser from "./components/FormCreateUser";

const CrearUsuarioScreen = () => {
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.container}>
      <FormCreateUser />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default CrearUsuarioScreen;
