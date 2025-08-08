import { ObtenerFacturaCita } from "@/core/gerenate-pdf/accions/get-generarePdf-cita";
import {
  Cita,
  Finca,
} from "@/core/medicos/interfaces/obtener-citas-medicos.interface";
import { Producto } from "@/core/productos/interfaces/response-productos-disponibles.interface";
import { obtenerTiempoViajeGoogleMaps } from "@/helpers/funciones/calcularDistancia";
import { formatDate } from "@/helpers/funciones/formatDate";
import { getStatusColor } from "@/helpers/funciones/getStatusColor";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;
const isTablet = width >= 768;

interface Props {
  item: Cita;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onAddProducts?: () => void;
  productosDisponibles?: Producto[];
  selectedProducts?: { [key: string]: { product: Producto; quantity: number } };
  totalAdicional?: number;
  onRemoveProduct?: (productId: string) => void;
}

const CardCitasMedico = ({
  item,
  onConfirm,
  onCancel,
  onComplete,
  onAddProducts,
  productosDisponibles,
  selectedProducts = {},
  totalAdicional = 0,
  onRemoveProduct,
}: Props) => {
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

  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#FFF",
      borderRadius: isSmallDevice ? 8 : isTablet ? 16 : 12,
      padding: isSmallDevice ? 12 : isTablet ? 20 : 16,
      marginVertical: isSmallDevice ? 6 : isTablet ? 12 : 8,
      marginHorizontal: isSmallDevice ? 10 : isTablet ? width * 0.05 : 16,
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
      marginBottom: isSmallDevice ? 8 : 12,
    },
    serviceInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    serviceName: {
      fontSize: isSmallDevice ? 12 : isTablet ? 16 : 14,
      fontWeight: "bold",
      color: "#333",
      marginLeft: isSmallDevice ? 6 : 8,
    },
    statusBadge: {
      paddingHorizontal: isSmallDevice ? 8 : 10,
      paddingVertical: isSmallDevice ? 3 : 5,
      borderRadius: 12,
    },
    statusText: {
      fontSize: isSmallDevice ? 6 : 8,
      fontWeight: "bold",
      color: "#FFF",
    },
    datetimeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: isSmallDevice ? 8 : 12,
      backgroundColor: "#F5F7FA",
      padding: isSmallDevice ? 8 : 10,
      borderRadius: 8,
    },
    datetimeItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    datetimeText: {
      marginLeft: isSmallDevice ? 6 : 8,
      fontSize: isSmallDevice ? 10 : 11,
      color: "#555",
      fontWeight: "500",
    },
    mapContainer: {
      height: isSmallDevice ? 120 : isTablet ? 200 : 150,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: isSmallDevice ? 8 : 12,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    locationInfo: {
      flexDirection: isSmallDevice ? "column" : "row",
      justifyContent: "space-between",
      marginBottom: isSmallDevice ? 8 : 12,
      gap: isSmallDevice ? 8 : 0,
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F7FA",
      paddingVertical: isSmallDevice ? 6 : 8,
      paddingHorizontal: isSmallDevice ? 10 : 12,
      borderRadius: 20,
      width: isSmallDevice ? "100%" : undefined,
    },
    locationText: {
      marginLeft: isSmallDevice ? 4 : 6,
      fontSize: isSmallDevice ? 12 : 14,
      color: "#333",
      fontWeight: "500",
    },
    section: {
      marginBottom: isSmallDevice ? 8 : 12,
      borderBottomWidth: 1,
      borderBottomColor: "#EEE",
      paddingBottom: isSmallDevice ? 8 : 12,
    },
    sectionTitle: {
      fontSize: isSmallDevice ? 10 : 12,
      fontWeight: "bold",
      color: "#666",
      marginBottom: isSmallDevice ? 4 : 6,
      textTransform: "uppercase",
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: isSmallDevice ? 6 : 8,
    },
    infoText: {
      marginLeft: isSmallDevice ? 6 : 8,
      fontSize: isSmallDevice ? 12 : 14,
      color: "#555",
      flex: 1,
    },
    animalInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: isSmallDevice ? 4 : 6,
    },
    animalText: {
      fontSize: isSmallDevice ? 12 : 14,
      color: "#333",
    },
    animalSubText: {
      fontSize: isSmallDevice ? 10 : 12,
      color: "#666",
      fontStyle: "italic",
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: isSmallDevice ? 6 : 8,
      paddingTop: isSmallDevice ? 6 : 8,
      borderTopWidth: 1,
      borderTopColor: "#EEE",
    },
    priceLabel: {
      fontSize: isSmallDevice ? 12 : 14,
      color: "#666",
      fontWeight: "bold",
    },
    priceValue: {
      fontSize: isSmallDevice ? 16 : 18,
      color: "#2E7D32",
      fontWeight: "bold",
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: isSmallDevice ? 8 : 12,
      gap: isSmallDevice ? 6 : 8,
    },
    actionButton: {
      flex: 1,
      paddingVertical: isSmallDevice ? 8 : 10,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    actionButtonText: {
      color: "#FFF",
      fontWeight: "bold",
      fontSize: isSmallDevice ? 12 : 14,
    },
    statusContainer: {
      padding: isSmallDevice ? 8 : 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: isSmallDevice ? 8 : 12,
    },
    statusLabel: {
      fontWeight: "bold",
      fontSize: isSmallDevice ? 12 : 14,
    },
    linkText: {
      color: "#1A73E8",
      textDecorationLine: "underline",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    animalDetails: {
      marginLeft: 8,
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
    completedContainer: {
      backgroundColor: "#E8F5E9",
    },
    canceledContainer: {
      backgroundColor: "#FFEBEE",
    },
    productsButton: {
      backgroundColor: "#FF9800",
    },
    productsSummary: {
      marginTop: 8,
      padding: 12,
      backgroundColor: "#F5F7FA",
      borderRadius: 8,
    },
    productItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
      padding: 8,
      backgroundColor: "#FFF",
      borderRadius: 6,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 12,
      color: "#333",
    },
    productPrice: {
      fontSize: 11,
      color: "#666",
    },
    productTotal: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#333",
      minWidth: 60,
      textAlign: "right",
    },
    deleteButton: {
      marginLeft: 8,
    },

    additionalTotal: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: "#E0E0E0",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    additionalTotalText: {
      fontWeight: "bold",
      color: "#2E7D32",
    },
    finalTotal: {
      marginTop: 4,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    finalTotalText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#2E7D32",
    },
  });

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

      {item.estado !== "completada" ? (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>VALOR SERVICIO:</Text>
          <Text style={styles.priceValue}>
            {user?.pais.simbolo_moneda}
            {item.totalPagar}
          </Text>
        </View>
      ) : (
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>TOTAL:</Text>
          <Text style={styles.priceValue}>
            {user?.pais.simbolo_moneda}
            {item.totalFinal}
          </Text>
        </View>
      )}
      {Object.keys(selectedProducts).length > 0 && (
        <View style={styles.productsSummary}>
          <Text style={styles.sectionTitle}>INSUMOS AGREGADOS</Text>
          {Object.values(selectedProducts).map(({ product, quantity }) => (
            <View key={product.id} style={styles.productItem}>
              <Text style={styles.productName}>
                {product.nombre} x {quantity}
              </Text>
              <Text style={styles.productTotal}>
                {user?.pais.simbolo_moneda}
                {(parseFloat(product.precio) * quantity).toFixed(2)}
              </Text>
              {onRemoveProduct && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onRemoveProduct(product.id)}
                >
                  <MaterialIcons name="delete" size={20} color="#F44336" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <View style={styles.additionalTotal}>
            <Text>Subtotal insumos:</Text>
            <Text style={styles.additionalTotalText}>
              {user?.pais.simbolo_moneda}
              {totalAdicional.toFixed(2)}
            </Text>
          </View>
          <View style={styles.finalTotal}>
            <Text>VALOR TOTAL:</Text>
            <Text style={styles.finalTotalText}>
              {user?.pais.simbolo_moneda}
              {(parseFloat(item.totalPagar) + totalAdicional).toFixed(2)}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.actionsContainer}>
        {item.estado.toLowerCase() === "pendiente" && onConfirm && (
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={styles.actionButtonText}>Confirmar</Text>
          </TouchableOpacity>
        )}

        {item.estado.toLowerCase() === "confirmada" && (
          <>
            {onAddProducts && (
              <TouchableOpacity
                style={[styles.actionButton, styles.productsButton]}
                onPress={onAddProducts}
              >
                <Text style={styles.actionButtonText}>Agregar Insumos</Text>
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
          </>
        )}

        {(item.estado.toLowerCase() === "pendiente" ||
          item.estado.toLowerCase() === "confirmada") &&
          onCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        {item.estado.toLowerCase() === "completada" && (
          <ThemedButton
            onPress={() => ObtenerFacturaCita(item.id)}
            title="Enviar Factura"
            style={styles.actionButton}
            icon="send-outline"
            variant="outline"
            iconPosition="right"
          />
        )}
      </View>
    </View>
  );
};

export default CardCitasMedico;
