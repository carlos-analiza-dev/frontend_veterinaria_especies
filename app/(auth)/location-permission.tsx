import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import { Button, Card, Icon, Text, useTheme } from "react-native-paper";

export default function LocationPermissionScreen() {
  const theme = useTheme();
  const colorPrimary = useThemeColor({}, "primary");
  const [status, setStatus] = useState<Location.PermissionStatus>(
    Location.PermissionStatus.UNDETERMINED
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setStatus(status);
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    setStatus(status);
    setIsLoading(false);

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
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon source="map-marker-radius" size={60} color={colorPrimary} />
          </View>

          <Text variant="headlineMedium" style={styles.title}>
            Ubicación Requerida
          </Text>

          <Text variant="bodyMedium" style={styles.description}>
            Para encontrar fincas cercanas y agendar citas, necesitamos acceso a
            tu ubicación.
          </Text>

          <Button
            mode="contained"
            onPress={handleRequestPermission}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            icon="map-marker-check"
            buttonColor={colorPrimary}
          >
            {isLoading ? "Verificando..." : "Permitir Ubicación"}
          </Button>

          {status === "denied" && (
            <Text style={[styles.warningText, { color: theme.colors.error }]}>
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
    padding: 20,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 24,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  description: {
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  buttonLabel: {
    fontSize: 16,
  },
  warningText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  iconContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
});
