import { Insumo } from "@/core/insumos/interfaces/response-insumos.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Card, Divider, List } from "react-native-paper";

interface Props {
  insumo: Insumo;
  onPress: () => void;
}

const CardInsumos = ({ insumo, onPress }: Props) => {
  const { width } = useWindowDimensions();
  const primary = useThemeColor({}, "primary");

  const isSmallDevice = width < 375;

  const isLargeDevice = width >= 414;

  return (
    <Card
      style={[
        styles.card,
        isSmallDevice && styles.smallCard,
        isLargeDevice && styles.largeCard,
      ]}
      onPress={onPress}
    >
      <Card.Content style={styles.cardContent}>
        <ThemedText
          style={[
            styles.title,
            isSmallDevice && styles.smallTitle,
            isLargeDevice && styles.largeTitle,
          ]}
        >
          {insumo.materiaPrima}
        </ThemedText>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            <ThemedText style={styles.boldText}>Cantidad SKU:</ThemedText>{" "}
            {insumo.cantidadSku}
          </ThemedText>
        </View>

        <Divider style={styles.divider} />

        <List.Section style={styles.listSection}>
          <List.Subheader style={styles.subheader}>Categorías</List.Subheader>
          {insumo.categorias.map((categoria, i) => (
            <List.Item
              key={i}
              title={categoria}
              titleStyle={styles.listItemTitle}
              left={() => <List.Icon icon="tag" color={primary} />}
              style={styles.listItem}
            />
          ))}
        </List.Section>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            <ThemedText style={styles.boldText}>Intereses:</ThemedText>{" "}
            {insumo.intereses}
          </ThemedText>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.datesContainer}>
          <ThemedText style={styles.dateText}>
            <ThemedText style={styles.boldText}>Creado:</ThemedText>{" "}
            {new Date(insumo.createdAt).toLocaleDateString()}
          </ThemedText>
          <ThemedText style={styles.dateText}>
            <ThemedText style={styles.boldText}>Actualizado:</ThemedText>{" "}
            {new Date(insumo.updatedAt).toLocaleDateString()}
          </ThemedText>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  smallCard: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
  largeCard: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 8,
  },
  smallTitle: {
    fontSize: 18,
  },
  largeTitle: {
    fontSize: 22,
  },
  infoContainer: {
    marginVertical: 4,
  },
  infoText: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
    height: 1,
  },
  listSection: {
    padding: 0,
    margin: 0,
  },
  subheader: {
    paddingHorizontal: 0,
    paddingLeft: 0,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  listItem: {
    paddingLeft: 0,
    paddingVertical: 4,
  },
  listItemTitle: {
    fontSize: 15,
  },
  datesContainer: {
    marginTop: 8,
  },
  dateText: {
    fontSize: 14,
    marginVertical: 2,
  },
});

export default CardInsumos;
