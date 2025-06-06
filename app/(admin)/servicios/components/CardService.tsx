import { Servicio } from "@/core/servicios/interfaces/response-servicios.interface";
import React from "react";

import { Card, Text } from "react-native-paper";

interface Props {
  services: Servicio;
  onPress: () => void;
}

const CardService = ({ services, onPress }: Props) => {
  return (
    <Card onPress={onPress}>
      <Card.Content>
        <Text variant="titleLarge">{services.nombre}</Text>
        <Text variant="bodyMedium">{services.descripcion}</Text>
      </Card.Content>
      <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
    </Card>
  );
};

export default CardService;
