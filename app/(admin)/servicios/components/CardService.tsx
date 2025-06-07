import { Servicio } from "@/core/servicios/interfaces/response-servicios.interface";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Badge, Card, Text, useTheme } from "react-native-paper";

interface Props {
  services: Servicio;
  onPress: () => void;
}

const CardService = ({ services, onPress }: Props) => {
  const theme = useTheme();

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Cover
        source={{ uri: "https://picsum.photos/700" }}
        style={styles.cover}
      />
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {services.nombre}
          </Text>
          <Badge
            style={[
              styles.badge,
              {
                backgroundColor: services.isActive
                  ? theme.colors.primary
                  : theme.colors.error,
              },
            ]}
          >
            {services.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </View>

        <Text
          variant="bodyMedium"
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {services.descripcion}
        </Text>
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
});

export default CardService;
