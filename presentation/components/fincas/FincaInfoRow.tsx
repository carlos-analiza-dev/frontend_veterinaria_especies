import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

type MaterialCommunityIconsName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

interface Props {
  icon: MaterialCommunityIconsName;
  text: string;
}

const FincaInfoRow = ({ icon, text }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.infoRow, { backgroundColor: colors.background }]}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.onSurfaceVariant}
      />
      <ThemedText style={[styles.infoText, { color: colors.onSurface }]}>
        {text}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
});

export default FincaInfoRow;
