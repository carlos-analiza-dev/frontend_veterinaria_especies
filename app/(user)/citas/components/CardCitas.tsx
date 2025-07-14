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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.subServicio.nombre}
        </Text>
        <View
          style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
        >
          <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.twoColumns}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={16} color="#555" />
            <Text style={styles.infoText}>{item.fecha}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={16} color="#555" />
            <Text style={styles.infoText}>
              {item.horaInicio} - {item.horaFin}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={16} color="#555" />
            <Text style={styles.infoText} numberOfLines={1}>
              Dr. {item.medico.usuario.name.split(" ")[0]}{" "}
              {item.medico.usuario.name.split(" ")[2] || ""}
            </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.infoRow}>
            <MaterialIcons name="pets" size={16} color="#555" />
            <Text style={styles.infoText}>{item.animal.especie.nombre}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="pets" size={16} color="#555" />
            <Text style={styles.infoText}>
              {item.animal.razas.length === 1
                ? item.animal.razas[0].nombre
                : item.animal.razas.length > 1
                ? "Encaste"
                : "Sin raza"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="tag" size={16} color="#555" />
            <Text style={styles.infoText}>{item.animal.identificador}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="location-on" size={16} color="#555" />
        <Text style={styles.infoText} numberOfLines={1}>
          {item.finca.nombre_finca}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="pets" size={16} color="#555" />
        <Text style={styles.infoText}>
          Cantidad: {item.cantidadAnimales} animal(es)
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.priceText}>
          Valor: {pais?.simbolo_moneda} {parseFloat(item.totalPagar).toFixed(2)}
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
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  twoColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexShrink: 1,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
    flex: 1,
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
