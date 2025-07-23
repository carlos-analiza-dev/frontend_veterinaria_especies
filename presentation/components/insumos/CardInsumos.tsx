import { Insumo } from "@/core/insumos/interfaces/response-insumos.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";

import { Card, Divider, List } from "react-native-paper";

interface Props {
  insumo: Insumo;
  onPress: () => void;
}

const CardInsumos = ({ insumo, onPress }: Props) => {
  const primary = useThemeColor({}, "primary");
  return (
    <Card key={insumo.id} style={{ margin: 16 }} onPress={onPress}>
      <Card.Content>
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 20, color: primary }}
        >
          {insumo.materiaPrima}
        </ThemedText>

        <ThemedText style={{ marginTop: 8 }}>
          <ThemedText style={{ fontWeight: "bold" }}>Cantidad SKU:</ThemedText>{" "}
          {insumo.cantidadSku}
        </ThemedText>

        <Divider style={{ marginVertical: 10 }} />

        <List.Section>
          <List.Subheader>Categorías</List.Subheader>
          {insumo.categorias.map((categoria, i) => (
            <List.Item
              key={i}
              title={categoria}
              left={() => <List.Icon icon="tag" />}
            />
          ))}
        </List.Section>

        <ThemedText style={{ marginTop: 10 }}>
          <ThemedText style={{ fontWeight: "bold" }}>Intereses:</ThemedText>{" "}
          {insumo.intereses}
        </ThemedText>

        <Divider style={{ marginVertical: 10 }} />

        <Divider style={{ marginVertical: 10 }} />

        <ThemedText>
          <ThemedText style={{ fontWeight: "bold" }}>Creado:</ThemedText>{" "}
          {new Date(insumo.createdAt).toLocaleDateString()}
        </ThemedText>
        <ThemedText>
          <ThemedText style={{ fontWeight: "bold" }}>Actualizado:</ThemedText>{" "}
          {new Date(insumo.updatedAt).toLocaleDateString()}
        </ThemedText>
      </Card.Content>
    </Card>
  );
};

export default CardInsumos;
