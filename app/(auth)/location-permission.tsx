import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Button, Card, Icon, Text, useTheme } from "react-native-paper";

export default function LocationPermissionScreen() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const colorPrimary = useThemeColor({}, "primary");
  const [status, setStatus] = useState<Location.PermissionStatus>(
    Location.PermissionStatus.UNDETERMINED
  );
  const [isLoading, setIsLoading] = useState(false);

  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 414;

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setStatus(status);
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);

      if (status === "granted") {
        router.replace("/(auth)/login");
      } else if (status === "denied") {
        Alert.alert(
          "Permiso requerido",
          "Por favor, activa los permisos de ubicación en Configuración.",
          [
            { text: "Cancelar", style: "cancel" },
            {
              text: "Abrir Configuración",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          padding: isSmallDevice ? 16 : 20,
        },
      ]}
    >
      <Card
        style={[
          styles.card,
          {
            width: isSmallDevice
              ? width * 0.9
              : isMediumDevice
              ? width * 0.85
              : Math.min(width * 0.8, 500),
            paddingVertical: isSmallDevice ? 16 : 24,
          },
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon
              source="map-marker-radius"
              size={isSmallDevice ? 50 : 60}
              color={colorPrimary}
            />
          </View>

          <Text
            variant={isSmallDevice ? "headlineSmall" : "headlineMedium"}
            style={styles.title}
          >
            Ubicación Requerida
          </Text>

          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              {
                marginBottom: isSmallDevice ? 24 : 32,
                fontSize: isSmallDevice ? 14 : 16,
                lineHeight: isSmallDevice ? 20 : 22,
              },
            ]}
          >
            Para encontrar fincas cercanas y agendar citas, necesitamos acceso a
            tu ubicación.
          </Text>

          <Button
            mode="contained"
            onPress={handleRequestPermission}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            labelStyle={[
              styles.buttonLabel,
              { fontSize: isSmallDevice ? 14 : 16 },
            ]}
            icon="map-marker-check"
            buttonColor={colorPrimary}
          >
            {isLoading ? "Verificando..." : "Permitir Ubicación"}
          </Button>

          {status === "denied" && (
            <Text
              style={[
                styles.warningText,
                {
                  color: theme.colors.error,
                  fontSize: isSmallDevice ? 12 : 14,
                },
              ]}
            >
              Permiso denegado. Por favor, actívalo manualmente en
              Configuración.
            </Text>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 16,
    alignSelf: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    opacity: 0.8,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  buttonLabel: {
    fontWeight: "500",
  },
  warningText: {
    marginTop: 8,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
});
