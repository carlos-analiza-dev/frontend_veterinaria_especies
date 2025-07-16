import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  finca: Finca;
}

const HeaderCard = ({ finca }: Props) => {
  const { colors } = useTheme();
  return (
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons
        name="home-assistant"
        size={30}
        color={colors.onSurfaceVariant}
      />
      <ThemedText style={styles.fincaName}>
        {finca.nombre_finca} ({finca.abreviatura})
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fincaName: {
    marginLeft: 8,
    flex: 1,
  },
});

export default HeaderCard;
