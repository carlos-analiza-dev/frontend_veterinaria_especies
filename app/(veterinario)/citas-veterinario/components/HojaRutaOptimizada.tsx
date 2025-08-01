import { Cita } from "@/core/medicos/interfaces/obtener-citas-medicos.interface";
import { obtenerTiempoViajeGoogleMaps } from "@/helpers/funciones/calcularDistancia";
import { formatDate } from "@/helpers/funciones/formatDate";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";

interface HojaRutaOptimizadaProps {
  citas: Cita[];
  onBack: () => void;
}

const HojaRutaOptimizada: React.FC<HojaRutaOptimizadaProps> = ({
  citas,
  onBack,
}) => {
  const [ubicacionActual, setUbicacionActual] =
    useState<Location.LocationObject | null>(null);
  const [citasOrdenadas, setCitasOrdenadas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerUbicacionYOrdenar = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permiso de ubicación denegado");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setUbicacionActual(location);

        const citasConDistancias = await Promise.all(
          citas.map(async (cita) => {
            if (!cita.finca.latitud || !cita.finca.longitud) {
              return { ...cita, distancia: Infinity };
            }

            const resultado = await obtenerTiempoViajeGoogleMaps(
              location.coords.latitude,
              location.coords.longitude,
              cita.finca.latitud,
              cita.finca.longitud
            );

            return {
              ...cita,
              distancia: resultado?.distanciaMetros
                ? resultado.distanciaMetros / 1000
                : Infinity,
              tiempoViaje: resultado?.tiempoTexto || "No calculado",
            };
          })
        );

        const ordenadas = [...citasConDistancias].sort(
          (a, b) => a.distancia - b.distancia
        );
        setCitasOrdenadas(ordenadas);
      } catch (err) {
        setError("Error al calcular la ruta optimizada");
      } finally {
        setLoading(false);
      }
    };

    obtenerUbicacionYOrdenar();
  }, [citas]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.loadingText}>Calculando ruta optimizada...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const coordenadasRuta = [
    ...(ubicacionActual
      ? [
          {
            latitude: ubicacionActual.coords.latitude,
            longitude: ubicacionActual.coords.longitude,
          },
        ]
      : []),
    ...citasOrdenadas
      .filter((cita) => cita.finca.latitud && cita.finca.longitud)
      .map((cita) => ({
        latitude: cita.finca.latitud!,
        longitude: cita.finca.longitud!,
      })),
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        <Text>Volver a la lista</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Ruta Optimizada</Text>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude:
              ubicacionActual?.coords.latitude ||
              citasOrdenadas[0]?.finca.latitud ||
              0,
            longitude:
              ubicacionActual?.coords.longitude ||
              citasOrdenadas[0]?.finca.longitud ||
              0,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2,
          }}
        >
          {ubicacionActual && (
            <Marker
              coordinate={{
                latitude: ubicacionActual.coords.latitude,
                longitude: ubicacionActual.coords.longitude,
              }}
              title="Tu ubicación"
              pinColor="#1a73e8"
            />
          )}

          {citasOrdenadas.map((cita, index) => (
            <Marker
              key={cita.id}
              coordinate={{
                latitude: cita.finca.latitud || 0,
                longitude: cita.finca.longitud || 0,
              }}
              title={`Cita ${index + 1}: ${cita.subServicio.nombre}`}
              description={`Distancia: ${cita.distancia?.toFixed(1)} km`}
            >
              <View style={styles.marker}>
                <Text style={styles.markerText}>{index + 1}</Text>
              </View>
            </Marker>
          ))}

          {coordenadasRuta.length > 1 && (
            <Polyline
              coordinates={coordenadasRuta}
              strokeColor="#1a73e8"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>

      <FlatList
        data={citasOrdenadas}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.citaItem}>
            <View style={styles.citaNumero}>
              <Text style={styles.citaNumeroText}>{index + 1}</Text>
            </View>
            <View style={styles.citaInfo}>
              <Text style={styles.citaNombre}>{item.finca.nombre_finca}</Text>
              <Text style={styles.citaDetalle}>
                {formatDate(item.fecha)} - {item.horaInicio}
              </Text>
              <Text style={styles.citaDistancia}>
                {item.distancia !== Infinity && item.distancia
                  ? `${item.distancia.toFixed(1)} km`
                  : "Distancia no disponible"}{" "}
                - {item.tiempoViaje}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    backgroundColor: "#1a73e8",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  citaItem: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  citaNumero: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  citaNumeroText: {
    color: "white",
    fontWeight: "bold",
  },
  citaInfo: {
    flex: 1,
  },
  citaNombre: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  citaDetalle: {
    color: "#555",
    marginBottom: 4,
  },
  citaDistancia: {
    color: "#1a73e8",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },

  loadingBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
});

export default HojaRutaOptimizada;
