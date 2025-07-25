import { FAB } from "@/presentation/components/FAB";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useNavigation } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const ProduccionGanaderoPage = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView></ThemedView>
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearProduccionPage")}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ProduccionGanaderoPage;
