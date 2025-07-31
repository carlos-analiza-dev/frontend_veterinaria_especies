import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Checkbox,
  Chip,
  IconButton,
  List,
  Text,
} from "react-native-paper";
import { useThemeColor } from "../hooks/useThemeColor";

interface Animal {
  id: string;
  identificador: string;
  sexo: string;
  color: string;
  profileImages?: { url: string }[];
}

interface ThemedAnimalPickerProps {
  animals: Animal[];
  selectedAnimals: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  label?: string;
  multiple?: boolean;
}

const ThemedAnimalPicker = ({
  animals,
  selectedAnimals,
  onSelectionChange,
  label = "Seleccionar animales",
  multiple = true,
}: ThemedAnimalPickerProps) => {
  const [expanded, setExpanded] = useState(false);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const unselectedAnimals = animals.filter(
    (animal) => !selectedAnimals.includes(animal.id)
  );

  const toggleAnimalSelection = (animalId: string) => {
    if (multiple) {
      const newSelection = selectedAnimals.includes(animalId)
        ? selectedAnimals.filter((id) => id !== animalId)
        : [...selectedAnimals, animalId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selectedAnimals.includes(animalId) ? [] : [animalId]);
    }
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <List.Accordion
        title={label}
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
        left={(props) => (
          <List.Icon {...props} icon="format-list-bulleted" color="black" />
        )}
        style={[styles.accordion, { backgroundColor }]}
        titleStyle={[{ color: textColor }]}
      >
        <View style={[styles.dropdown, { backgroundColor }]}>
          {selectedAnimals.length > 0 && multiple && (
            <View style={styles.clearButtonContainer}>
              <IconButton
                icon="close"
                size={20}
                onPress={handleClearSelection}
                style={styles.clearButton}
                iconColor={textColor}
              />
              <Text style={[styles.clearText, { color: textColor }]}>
                Limpiar selección
              </Text>
            </View>
          )}

          <ScrollView style={styles.scrollView} nestedScrollEnabled={true}>
            {unselectedAnimals.length > 0 ? (
              unselectedAnimals.map((animal) => (
                <List.Item
                  key={animal.id}
                  title={animal.identificador}
                  description={`${animal.sexo} - ${animal.color}`}
                  left={(props) => (
                    <View style={styles.listItemLeft}>
                      <Checkbox.Android
                        status="unchecked"
                        onPress={() => toggleAnimalSelection(animal.id)}
                        color={primaryColor}
                      />
                      {animal.profileImages?.[0]?.url ? (
                        <Avatar.Image
                          size={40}
                          source={{
                            uri: animal.profileImages[0].url.replace(
                              "localhost",
                              process.env.EXPO_PUBLIC_API || "192.168.0.10"
                            ),
                          }}
                          style={styles.avatar}
                        />
                      ) : (
                        <Avatar.Image
                          size={40}
                          source={require("@/images/profile.png")}
                          style={styles.avatar}
                        />
                      )}
                    </View>
                  )}
                  style={styles.listItem}
                  titleStyle={[{ color: textColor, fontSize: 13 }]}
                  descriptionStyle={[
                    styles.listItemDescription,
                    { color: textColor },
                  ]}
                  onPress={() => toggleAnimalSelection(animal.id)}
                />
              ))
            ) : (
              <Text style={[styles.emptyText, { color: textColor }]}>
                Todos los animales han sido seleccionados
              </Text>
            )}
          </ScrollView>
        </View>
      </List.Accordion>

      {selectedAnimals.length > 0 && (
        <View style={styles.selectedContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {selectedAnimals.map((animalId) => {
              const animal = animals.find((a) => a.id === animalId);
              return animal ? (
                <Chip
                  key={animalId}
                  style={[
                    styles.selectedChip,
                    { backgroundColor: backgroundColor },
                  ]}
                  textStyle={{ color: "black" }}
                  onPress={() => toggleAnimalSelection(animalId)}
                  avatar={
                    animal.profileImages?.[0]?.url ? (
                      <Avatar.Image
                        size={24}
                        source={{
                          uri: animal.profileImages[0].url.replace(
                            "localhost",
                            process.env.EXPO_PUBLIC_API || "192.168.0.10"
                          ),
                        }}
                      />
                    ) : (
                      <Avatar.Image
                        size={24}
                        source={require("@/images/profile.png")}
                      />
                    )
                  }
                  closeIcon="close"
                  onClose={() => toggleAnimalSelection(animalId)}
                >
                  {animal.identificador}
                </Chip>
              ) : null;
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  accordion: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dropdown: {
    maxHeight: Dimensions.get("window").height * 0.4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  scrollView: {
    paddingHorizontal: 8,
  },
  listItem: {
    paddingVertical: 12,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  avatar: {
    marginLeft: 12,
    marginRight: 8,
  },
  clearButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  clearButton: {
    margin: 0,
  },
  clearText: {
    fontSize: 14,
    marginLeft: -8,
  },
  selectedContainer: {
    marginTop: 8,
    minHeight: 40,
  },
  chipsContainer: {
    paddingHorizontal: 8,
  },
  selectedChip: {
    marginRight: 8,
    height: 32,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    fontStyle: "italic",
  },
});

export default ThemedAnimalPicker;
