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
  View,
} from "react-native";
import { Avatar, Card, Chip, Divider, useTheme } from "react-native-paper";

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

  const getIconName = () => {
    switch (animal.especie.nombre) {
      case "Bovino":
        return "cow";
      case "Porcino":
        return "pig";
      case "Equino":
        return "horse";
      default:
        return "paw";
    }
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
            subtitle={`${animal.especie.nombre} - ${animal.raza.nombre} - ${animal.sexo}`}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon={getIconName()}
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
                Nacimiento:
                {new Date(animal.fecha_nacimiento).toLocaleDateString()}
              </ThemedText>
            </ThemedView>

            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Registro: {new Date(animal.fecha_registro).toLocaleDateString()}
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
                Edad: {animal.edad_promedio} años
              </ThemedText>
            </ThemedView>

            {animal.tipo_alimentacion.length > 0 && (
              <ThemedView
                style={[styles.infoRow, { backgroundColor: colors.background }]}
              >
                <MaterialCommunityIcons
                  name="silverware-clean"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.icon}
                />
                <View style={styles.chipsContainer}>
                  {animal.tipo_alimentacion.map((alimento, index) => (
                    <Chip
                      key={`${alimento.alimento}-${index}`}
                      style={[
                        styles.smallChip,
                        {
                          backgroundColor: colors.secondaryContainer,
                          marginRight: 4,
                          marginBottom: 4,
                        },
                      ]}
                      textStyle={{
                        color: colors.onSecondaryContainer,
                        fontSize: 12,
                      }}
                    >
                      {alimento.alimento}{" "}
                      {alimento.origen ? `(${alimento.origen})` : ""}
                    </Chip>
                  ))}
                </View>
              </ThemedView>
            )}
            {animal.complementos && animal.complementos.length > 0 && (
              <ThemedView
                style={[styles.infoRow, { backgroundColor: colors.background }]}
              >
                <View style={styles.chipsContainer}>
                  <ThemedText
                    style={[styles.infoText, { color: colors.onSurface }]}
                  >
                    Comp:
                  </ThemedText>
                  {animal.complementos.map((complemento, index) => (
                    <Chip
                      key={`${complemento.complemento}-${index}`}
                      style={[
                        styles.smallChip,
                        {
                          backgroundColor: colors.tertiaryContainer,
                          marginRight: 4,
                          marginBottom: 4,
                        },
                      ]}
                      textStyle={{
                        color: colors.onTertiaryContainer,
                        fontSize: 12,
                      }}
                    >
                      {complemento.complemento}
                    </Chip>
                  ))}
                </View>
              </ThemedView>
            )}
            {animal.medicamento && (
              <ThemedView
                style={[styles.infoRow, { backgroundColor: colors.background }]}
              >
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={20}
                  color={colors.onSurfaceVariant}
                  style={styles.icon}
                />
                <ThemedText
                  style={[styles.infoText, { color: colors.onSurface }]}
                >
                  Medicamento: {animal.medicamento}
                </ThemedText>
              </ThemedView>
            )}
            {animal.sexo === "Macho" && (
              <ThemedView
                style={[styles.infoRow, { backgroundColor: colors.background }]}
              >
                <ThemedText>Castrado:</ThemedText>
                <View style={styles.chipsContainer}>
                  <Chip
                    style={[
                      styles.smallChip,
                      { backgroundColor: colors.secondaryContainer },
                    ]}
                    textStyle={{ color: colors.onSecondaryContainer }}
                  >
                    {animal.castrado === true ? "Si" : "No"}
                  </Chip>
                </View>
              </ThemedView>
            )}
            {animal.sexo === "Hembra" && (
              <ThemedView
                style={[styles.infoRow, { backgroundColor: colors.background }]}
              >
                <ThemedText>Esterilizado:</ThemedText>
                <View style={styles.chipsContainer}>
                  <Chip
                    style={[
                      styles.smallChip,
                      { backgroundColor: colors.secondaryContainer },
                    ]}
                    textStyle={{ color: colors.onSecondaryContainer }}
                  >
                    {animal.esterelizado === true ? "Si" : "No"}
                  </Chip>
                </View>
              </ThemedView>
            )}

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

            <ThemedView
              style={[styles.infoRow, { backgroundColor: colors.background }]}
            >
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={colors.onSurfaceVariant}
              />
              <ThemedText
                style={[styles.infoText, { color: colors.onSurface }]}
              >
                Propietario: {animal.propietario.name}
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
                  Caracteristicas: {animal.observaciones}
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
    alignItems: "flex-start",
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
  statusContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  chip: {
    marginHorizontal: 2,
    height: 24,
  },
  smallChip: {
    marginVertical: 2,
    height: 32,
    borderRadius: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    marginLeft: 8,
    gap: 4,
  },
  icon: {
    marginTop: 4,
  },
});

export default AnimalCard;
