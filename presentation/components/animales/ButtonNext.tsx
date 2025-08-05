import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { Button } from "react-native-paper";

interface Props {
  onPress: () => void;
}

const ButtonNext = ({ onPress }: Props) => {
  const primary = useThemeColor({}, "primary");
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 16,
      }}
    >
      <Button
        mode="outlined"
        onPress={onPress}
        contentStyle={{
          flexDirection: "row-reverse",
          alignItems: "center",
        }}
        labelStyle={{ marginRight: 18, color: primary }}
        icon="arrow-right"
      >
        Siguiente
      </Button>
    </ThemedView>
  );
};

export default ButtonNext;
