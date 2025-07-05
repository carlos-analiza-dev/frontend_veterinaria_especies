import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import {
  Button,
  Modal,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

interface Props {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (
    direccion: string,
    coords: { latitude: number; longitude: number }
  ) => void;
}

const MapaSeleccionDireccion = ({
  visible,
  onClose,
  onLocationSelect,
}: Props) => {
  const [region, setRegion] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [direccion, setDireccion] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (!visible) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación denegado");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, [visible]);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    try {
      const [reverse] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverse) {
        const dir = `${reverse.street || ""}, ${reverse.city || ""}, ${
          reverse.region || ""
        }, ${reverse.country || ""}`;
        setDireccion(dir);
      } else {
        setDireccion("Ubicación seleccionada");
      }
    } catch (error) {
      Alert.alert("Error al obtener la dirección");
      setDireccion("Ubicación seleccionada");
    }
  };

  const confirmarUbicacion = () => {
    if (direccion && marker) {
      onLocationSelect(direccion, marker);
      onClose();
    }
  };

  if (!region) return null;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modal}
      >
        <View style={{ flex: 1 }}>
          <MapView
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>

          {direccion !== "" && (
            <Surface
              style={[
                styles.infoBox,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                {direccion}
              </Text>
              <Button mode="contained" onPress={confirmarUbicacion}>
                Usar esta ubicación
              </Button>
            </Surface>
          )}

          <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
            X
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  infoBox: {
    padding: 16,
    elevation: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 16,
  },
});

export default MapaSeleccionDireccion;
