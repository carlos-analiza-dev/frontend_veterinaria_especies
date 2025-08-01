import { Cita } from "@/core/citas/interfaces/response-citas-user.interface";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Cita;
  onPress?: () => void;
}

const CardCitas = ({ item, onPress }: Props) => {
  const { user } = useAuthStore();
  const pais = user?.pais;

  const getStatusColor = () => {
    switch (item.estado.toLowerCase()) {
      case "pendiente":
        return "#FFA500";
      case "cancelada":
        return "#FF0000";
      case "completada":
        return "#4CAF50";
      default:
        return "#A0A0A0";
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.serviceContainer}>
          <MaterialIcons name="medical-services" size={20} color="#4A90E2" />
          <Text style={styles.serviceName} numberOfLines={1}>
            {item.subServicio.nombre}
          </Text>
        </View>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeItem}>
          <MaterialIcons name="calendar-today" size={16} color="#555" />
          <Text style={styles.dateTimeText}>{formatDate(item.fecha)}</Text>
        </View>
        <View style={styles.dateTimeItem}>
          <MaterialIcons name="access-time" size={16} color="#555" />
          <Text style={styles.dateTimeText}>
            {formatTime(item.horaInicio)} - {formatTime(item.horaFin)}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={16} color="#555" />
          <Text style={styles.infoText} numberOfLines={1}>
            Dr. {item.medico.nombre}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color="#555" />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.finca.nombre} -{" "}
            {item.finca.ubicacion.split(",")[1]?.trim() || item.finca.ubicacion}
          </Text>
        </View>
      </View>

      {item.animales.length > 0 && (
        <View style={styles.animalsSection}>
          <Text style={styles.sectionTitle}>
            Animales ({item.animales.length})
          </Text>
          {item.animales.map((animal, index) => (
            <View key={`${animal.id}-${index}`} style={styles.animalItem}>
              <View style={styles.animalInfo}>
                <MaterialIcons name="pets" size={16} color="#555" />
                <Text style={styles.animalText}>
                  {animal.identificador} - {animal.especie}
                </Text>
              </View>
              <Text style={styles.animalRaces}>
                {animal.razas.length === 1
                  ? animal.razas[0]
                  : animal.razas.length > 1
                  ? "Encaste"
                  : "Sin raza"}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.priceText}>
          Total: {pais?.simbolo_moneda || "$"}{" "}
          {parseFloat(item.totalPagar).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
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
  serviceContainer: {
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
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateTimeText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  infoSection: {
    marginBottom: 12,
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
  animalsSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  animalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingVertical: 4,
  },
  animalInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  animalText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  animalRaces: {
    fontSize: 13,
    color: "#777",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 8,
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
  },
});

export default CardCitas;
