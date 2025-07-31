import { Servicio } from "@/core/servicios/interfaces/response-servicios.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

interface Props {
  services: Servicio;
  onPress: () => void;
}

const CardServiceUsers = ({ services, onPress }: Props) => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.background }]}
      onPress={onPress}
    >
      <Card.Cover
        source={require("@/images/servicio_image.png")}
        style={styles.cover}
      />
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {services.nombre}
          </Text>
        </View>

        <ThemedButton
          onPress={onPress}
          title="Agendar Cita"
          icon="arrow-forward-outline"
        />
      </Card.Content>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    margin: 8,
    overflow: "hidden",
  },
  cover: {
    height: 120,
  },
  content: {
    paddingTop: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    flexShrink: 1,
    marginRight: 8,
  },
  description: {
    color: "#666",
    marginBottom: 8,
  },
  badge: {
    alignSelf: "flex-start",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 12,
  },
  smallButton: {
    minWidth: 0,
  },
});
export default CardServiceUsers;
