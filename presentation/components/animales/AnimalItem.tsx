import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React from "react";
import { Image, StyleSheet } from "react-native";

interface AnimalItem {
  value: string;
  label: string;
  imageUrl?: string;
  identificador: string;
  sexo: string;
  color: string;
}

const AnimalItem = ({ item }: { item: AnimalItem }) => {
  return (
    <ThemedView style={styles.animalItemContainer}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.animalImage}
          resizeMode="cover"
        />
      )}
      <ThemedView style={styles.animalInfo}>
        <ThemedText style={styles.animalLabel}>{item.label}</ThemedText>
        <ThemedText style={styles.animalDetails}>
          {item.sexo} - {item.color}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  animalItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  animalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  animalInfo: {
    flex: 1,
  },
  animalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  animalDetails: {
    fontSize: 14,
    color: "#666",
  },
});

export default AnimalItem;
