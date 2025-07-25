import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Button, useTheme } from "react-native-paper";

interface Props {
  onPress: () => void;
}

const ButtonNext = ({ onPress }: Props) => {
  const { colors } = useTheme();
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 16,
        backgroundColor: colors.background,
      }}
    >
      <Button
        mode="outlined"
        onPress={onPress}
        contentStyle={{
          flexDirection: "row-reverse",
          alignItems: "center",
        }}
        labelStyle={{ marginRight: 18 }}
        icon="arrow-right"
      >
        Siguiente
      </Button>
    </ThemedView>
  );
};

export default ButtonNext;
