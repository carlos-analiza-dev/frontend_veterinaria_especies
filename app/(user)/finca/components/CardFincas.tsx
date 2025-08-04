import { Finca } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import { getSpeciesIcon } from "@/helpers/funciones/getEspecies";
import { getTipoExplotacionIcon } from "@/helpers/funciones/getExplotacion";
import FincaInfoRow from "@/presentation/components/fincas/FincaInfoRow";
import HeaderCard from "@/presentation/components/fincas/HeaderCard";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Card, Divider, useTheme } from "react-native-paper";

interface Props {
  finca: Finca;
  onPress: () => void;
}

const CardFincas = ({ finca, onPress }: Props) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;
  const { height, width } = Dimensions.get("window");
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: height * 0.02,
      marginHorizontal: width * 0.02,
    },
    card: {
      marginBottom: height * 0.015,
      elevation: 2,
      overflow: "hidden",
      borderRadius: width * 0.03,
    },
    divider: {
      marginVertical: height * 0.01,
    },
    fincaName: {
      marginLeft: width * 0.02,
      flex: 1,
      fontSize: width * 0.04,
      fontWeight: "bold",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginVertical: height * 0.005,
    },
    infoText: {
      marginLeft: width * 0.02,
      flex: 1,
      fontSize: width * 0.035,
    },
    speciesContainer: {
      flex: 1,
      marginLeft: width * 0.02,
    },
    speciesList: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: height * 0.005,
    },
    speciesItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: width * 0.03,
      marginBottom: height * 0.005,
    },
    speciesIcon: {
      marginRight: width * 0.01,
      fontSize: width * 0.04,
    },
    speciesText: {
      fontSize: width * 0.035,
    },
    cardContainer: {
      marginBottom: height * 0.015,
      marginHorizontal: width * 0.02,
    },
    mapContainer: {
      marginTop: height * 0.01,
      height: height * 0.2,
      borderRadius: width * 0.03,
      overflow: "hidden",
    },
    map: {
      flex: 1,
    },
    markerContainer: {
      width: width * 0.08,
      height: width * 0.08,
      borderRadius: width * 0.04,
      justifyContent: "center",
      alignItems: "center",
    },
  });

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-HN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Activa" : "Inactiva";
  };

  return (
    <View style={styles.container}>
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
          <Card
            onPress={onPress}
            style={[styles.card, { backgroundColor: colors.background }]}
          >
            <Card.Content>
              <HeaderCard finca={finca} />

              <Divider style={styles.divider} />
              <FincaInfoRow
                icon="cow"
                text={`${finca.cantidad_animales} animales`}
              />

              <FincaInfoRow
                icon="map-marker"
                text={`${finca.municipio.nombre}, ${finca.departamento.nombre}`}
              />

              <FincaInfoRow
                icon="texture-box"
                text={`${finca.tamaño_total_hectarea} ${finca.medida_finca} Totales - ${finca.area_ganaderia_hectarea} ${finca.medida_finca} para ganadería`}
              />

              <View style={styles.speciesContainer}>
                <ThemedText style={styles.infoText}>Explotacion:</ThemedText>
                <View style={styles.speciesList}>
                  {finca.tipo_explotacion.map(({ tipo_explotacion }, index) => (
                    <View key={index} style={styles.speciesItem}>
                      <MaterialCommunityIcons
                        name={getTipoExplotacionIcon(tipo_explotacion)}
                        size={16}
                        color={colors.onSurfaceVariant}
                        style={styles.speciesIcon}
                      />
                      <ThemedText style={styles.speciesText}>
                        {tipo_explotacion}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="paw"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <View style={styles.speciesContainer}>
                  <ThemedText style={styles.infoText}>Especies:</ThemedText>
                  <View style={styles.speciesList}>
                    {finca.especies_maneja.map(
                      ({ especie, cantidad }, index) => (
                        <View key={index} style={styles.speciesItem}>
                          <MaterialCommunityIcons
                            name={getSpeciesIcon(especie)}
                            size={16}
                            color={colors.onSurfaceVariant}
                            style={styles.speciesIcon}
                          />
                          <ThemedText style={styles.speciesText}>
                            {especie} - {cantidad}
                          </ThemedText>
                        </View>
                      )
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color={colors.onSurfaceVariant}
                />
                <ThemedText style={styles.infoText}>
                  Registrada: {formatDate(finca.fecha_registro)}
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name={finca.isActive ? "check-circle" : "close-circle"}
                  size={20}
                  color={finca.isActive ? colors.primary : colors.error}
                />
                <ThemedText style={styles.infoText}>
                  Estado: {getStatusText(finca.isActive)}
                </ThemedText>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </TouchableWithoutFeedback>
      <ThemedText
        style={[styles.fincaName, { fontSize: 16, fontWeight: "bold" }]}
      >
        Ubicacion - {finca.nombre_finca}
      </ThemedText>
      {finca.latitud && finca.longitud && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: finca.latitud,
              longitude: finca.longitud,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            loadingIndicatorColor={colors.primary}
            loadingBackgroundColor={colors.surfaceVariant}
          >
            <Marker
              coordinate={{
                latitude: finca.latitud,
                longitude: finca.longitud,
              }}
              title={finca.nombre_finca}
              description={finca.ubicacion || ""}
            />
          </MapView>
        </View>
      )}
    </View>
  );
};

export default CardFincas;
