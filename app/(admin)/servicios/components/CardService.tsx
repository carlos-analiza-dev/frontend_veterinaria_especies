import { Servicio } from "@/core/servicios/interfaces/response-servicios.interface";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge, Button, Card, Text, useTheme } from "react-native-paper";
import ModalEditService from "./ModalEditService";

interface Props {
  services: Servicio;
  onPress: () => void;
}

const CardService = ({ services, onPress }: Props) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [servicioId, setServicioId] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    if (services) {
      setServicioId(services.id);
    }
  }, [services]);

  return (
    <>
      <Card style={styles.card} onPress={onPress}>
        <Card.Cover
          source={{ uri: "https://picsum.photos/700" }}
          style={styles.cover}
        />
        <Card.Content style={styles.content}>
          <ThemedView
            style={[
              styles.buttonsContainer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <Button
              mode="outlined"
              onPress={showModal}
              compact
              style={styles.smallButton}
              icon="pencil"
            >
              Editar
            </Button>
          </ThemedView>
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
      <ModalEditService
        visible={visible}
        hideModal={hideModal}
        servicioId={servicioId}
      />
    </>
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

export default CardService;
