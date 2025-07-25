import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SegmentedButtons, useTheme } from "react-native-paper";

type ProductionSection =
  | "ganadera"
  | "alternativa"
  | "forrajes"
  | "agricola"
  | "apicultura";

const CrearProduccionPage = () => {
  const { user } = useAuthStore();
  const [section, setSection] = useState<ProductionSection>("ganadera");
  const { colors } = useTheme();

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const sectionButtons = [
    {
      value: "ganadera",

      icon: "cow",
      style: section === "ganadera" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "alternativa",

      icon: "swap-horizontal",
      style:
        section === "alternativa" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "forrajes",

      icon: "grass",
      style: section === "forrajes" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "agricola",

      icon: "sprout",
      style: section === "agricola" ? { backgroundColor: colors.primary } : {},
    },
    {
      value: "apicultura",

      icon: "bee",
      style:
        section === "apicultura" ? { backgroundColor: colors.primary } : {},
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.segmentContainer}>
        <SegmentedButtons
          value={section}
          onValueChange={(value) => setSection(value as ProductionSection)}
          buttons={sectionButtons}
        />
      </ThemedView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ThemedPicker
          items={fincasItems}
          onValueChange={(value) => {}}
          selectedValue={""}
          placeholder="Selecciona una finca"
          icon="podium-outline"
        />
      </KeyboardAvoidingView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  segmentContainer: {
    marginVertical: 16,
  },
});

export default CrearProduccionPage;
