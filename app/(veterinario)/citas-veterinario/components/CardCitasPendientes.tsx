import {
  Cita,
  Finca,
} from "@/core/medicos/interfaces/obtener-citas-medicos.interface";
import { obtenerTiempoViajeGoogleMaps } from "@/helpers/funciones/calcularDistancia";
import { formatDate } from "@/helpers/funciones/formatDate";
import { getStatusColor } from "@/helpers/funciones/getStatusColor";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

interface Props {
  item: Cita;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

const CardCitasMedico = ({ item, onConfirm, onCancel, onComplete }: Props) => {
  const { user } = useAuthStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoadingLocation(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (item.finca.latitud && item.finca.longitud) {
          const resultado = await obtenerTiempoViajeGoogleMaps(
            currentLocation.coords.latitude,
            currentLocation.coords.longitude,
            item.finca.latitud,
            item.finca.longitud
          );

          if (
            resultado &&
            resultado.distanciaMetros !== null &&
            resultado.distanciaTexto !== null
          ) {
            setDistance(resultado.distanciaMetros / 1000);
            setTravelTime(resultado.tiempoTexto);
          }
        }
      } catch (error) {
        console.error("Error fetching location:", error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchLocationData();
  }, [item.finca.latitud, item.finca.longitud]);

  const handleOpenMap = (finca: Finca) => {
    if (finca.latitud && finca.longitud) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${finca.latitud},${finca.longitud}`;
      Linking.openURL(url).catch((err) =>
        console.error("Error opening maps:", err)
      );
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
      console.error("Error calling:", err)
    );
  };

  const mapRegion = {
    latitude: item.finca.latitud || 0,
    longitude: item.finca.longitud || 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const primaryAnimal = item.animales[0] || {};
  const ownerPhone = primaryAnimal.propietario?.telefono;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.serviceInfo}>
          <MaterialIcons name="medical-services" size={20} color="#4A90E2" />
          <Text style={styles.serviceName}>{item.subServicio.nombre}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item) },
          ]}
        >
          <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.datetimeContainer}>
        <View style={styles.datetimeItem}>
          <MaterialIcons name="calendar-today" size={16} color="#555" />
          <Text style={styles.datetimeText}>{formatDate(item.fecha)}</Text>
        </View>
        <View style={styles.datetimeItem}>
          <MaterialIcons name="access-time" size={16} color="#555" />
          <Text style={styles.datetimeText}>
            {item.horaInicio.substring(0, 5)} - {item.horaFin.substring(0, 5)}
          </Text>
        </View>
      </View>

      {item.finca.latitud && item.finca.longitud && (
        <TouchableOpacity
          style={styles.mapContainer}
          onPress={() => handleOpenMap(item.finca)}
          activeOpacity={0.8}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: item.finca.latitud,
                longitude: item.finca.longitud,
              }}
              title={item.finca.nombre_finca}
            />
          </MapView>
        </TouchableOpacity>
      )}

      <View style={styles.locationInfo}>
        <View style={styles.locationItem}>
          <MaterialIcons name="location-on" size={20} color="#4A90E2" />
          <Text style={styles.locationText}>
            {loadingLocation
              ? "Calculando..."
              : distance
              ? `${distance.toFixed(1)} km`
              : "Distancia no disponible"}
          </Text>
        </View>
        <View style={styles.locationItem}>
          <MaterialIcons name="directions-car" size={20} color="#4A90E2" />
          <Text style={styles.locationText}>
            {loadingLocation
              ? "Calculando..."
              : travelTime
              ? `${travelTime} en auto`
              : "Tiempo no disponible"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PACIENTE(S)</Text>
        {item.animales.map((animal, index) => (
          <View key={`${animal.id}-${index}`} style={styles.animalInfo}>
            <MaterialIcons name="pets" size={16} color="#555" />
            <View style={styles.animalDetails}>
              <Text style={styles.animalText}>
                {animal.identificador} - {animal.especie}
              </Text>
              <Text style={styles.animalSubText}>
                {animal.razas.length === 1
                  ? animal.razas[0]
                  : animal.razas.length > 1
                  ? "Encaste"
                  : "Sin raza"}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROPIETARIO</Text>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={16} color="#555" />
          <Text style={styles.infoText}>
            {primaryAnimal.propietario?.name || "No especificado"}
          </Text>
        </View>
        {ownerPhone && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleCall(ownerPhone)}
          >
            <MaterialIcons name="phone" size={16} color="#555" />
            <Text style={[styles.infoText, styles.linkText]}>{ownerPhone}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FINCA</Text>
        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleOpenMap(item.finca)}
        >
          <MaterialIcons name="location-on" size={16} color="#555" />
          <Text style={[styles.infoText, styles.linkText]} numberOfLines={1}>
            {item.finca.nombre_finca}
          </Text>
        </TouchableOpacity>
        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={16} color="#555" />
          <Text style={styles.infoText} numberOfLines={2}>
            {item.finca.ubicacion.split(",").slice(1).join(",").trim() ||
              item.finca.ubicacion}
          </Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>VALOR:</Text>
        <Text style={styles.priceValue}>
          {user?.pais.simbolo_moneda}
          {item.totalPagar}
        </Text>
      </View>

      {item.estado.toLowerCase() === "pendiente" && (
        <View style={styles.actionsContainer}>
          {onCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          {onComplete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={onComplete}
            >
              <Text style={styles.actionButtonText}>Completar</Text>
            </TouchableOpacity>
          )}
          {onConfirm && (
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.actionButtonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {item.estado.toLowerCase() !== "pendiente" && (
        <View
          style={[
            styles.statusContainer,
            item.estado.toLowerCase() === "completada"
              ? styles.completedContainer
              : styles.canceledContainer,
          ]}
        >
          <Text style={styles.statusLabel}>{item.estado.toUpperCase()}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#F5F7FA",
    padding: 10,
    borderRadius: 8,
  },
  datetimeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  datetimeText: {
    marginLeft: 8,
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },
  mapContainer: {
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  section: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  animalInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  animalDetails: {
    marginLeft: 8,
  },
  animalText: {
    fontSize: 14,
    color: "#333",
  },
  animalSubText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  priceValue: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  completeButton: {
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  completedContainer: {
    backgroundColor: "#E8F5E9",
  },
  canceledContainer: {
    backgroundColor: "#FFEBEE",
  },
  statusLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  linkText: {
    color: "#1A73E8",
    textDecorationLine: "underline",
  },
});

export default CardCitasMedico;
