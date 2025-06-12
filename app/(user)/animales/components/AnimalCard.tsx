import { ResponseAnimalesByPropietario } from "@/core/animales/interfaces/response-animales.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Card, Divider, useTheme } from "react-native-paper";

interface Props {
  animal: ResponseAnimalesByPropietario;
  onPress: () => void;
}

const AnimalCard = ({ animal, onPress }: Props) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      delayPressIn={0}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Title
            title={animal.identificador}
            subtitle={`${animal.raza} - ${animal.sexo}`}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon={animal.especie === "Bovino" ? "cow" : "paw"}
                color={colors.primary}
                style={{ backgroundColor: colors.surfaceVariant }}
              />
            )}
            titleStyle={{ color: colors.onSurface }}
            subtitleStyle={{ color: colors.onSurfaceVariant }}
          />
          <Card.Content>
            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="calendar"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Nacimiento:{" "}
                {new Date(animal.fecha_nacimiento).toLocaleDateString()}
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="palette"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Color: {animal.color}
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="clock"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Edad: {animal.edad_promedio}
              </ThemedText>
            </ThemedView>

            <Divider
              style={[styles.divider, { backgroundColor: colors.outline }]}
            />

            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="home"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Finca: {animal.finca.nombre_finca} ({animal.finca.abreviatura})
              </ThemedText>
            </ThemedView>

            {animal.observaciones && (
              <ThemedView
                style={[
                  styles.infoColumn,
                  { backgroundColor: colors.background },
                ]}
              >
                <MaterialCommunityIcons
                  name="note-text"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <ThemedText
                  style={[styles.infoText, { color: colors.onSurface }]}
                >
                  Observaciones: {animal.observaciones}
                </ThemedText>
              </ThemedView>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    marginHorizontal: 8,
  },
  card: {
    elevation: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  infoColumn: {
    flexDirection: "column",
    marginVertical: 4,
    padding: 4,
    borderRadius: 6,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});

export default AnimalCard;
