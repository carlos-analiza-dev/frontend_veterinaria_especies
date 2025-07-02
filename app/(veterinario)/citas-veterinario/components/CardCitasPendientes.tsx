import { Cita } from "@/core/citas/interfaces/response-citas-user.interface";
import { formatDate } from "@/helpers/funciones/formatDate";
import { getStatusColor } from "@/helpers/funciones/getStatusColor";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  item: Cita;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
}

const CardCitasMedico = ({ item, onConfirm, onCancel, onComplete }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceName} numberOfLines={1}>
          {item.subServicio.nombre}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item) },
          ]}
        >
          <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <MaterialIcons name="calendar-today" size={16} color="#555" />
          <Text style={styles.infoText}>{formatDate(item.fecha)}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color="#555" />
          <Text style={styles.infoText}>
            {item.horaInicio} - {item.horaFin} ({item.duracion} hrs)
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={16} color="#555" />
          <Text style={styles.infoText}>
            Paciente: {item.animal.identificador}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="pets" size={16} color="#555" />
          <Text style={styles.infoText}>
            {item.animal.especie.nombre} - {item.animal.raza.nombre}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color="#555" />
          <Text style={styles.infoText} numberOfLines={1}>
            Finca: {item.finca.nombre_finca} ({item.finca.ubicacion})
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="people" size={16} color="#555" />
          <Text style={styles.infoText}>
            Propietario: {item.animal.propietario.name}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="phone" size={16} color="#555" />
          <Text style={styles.infoText}>
            Teléfono: {item.animal.propietario.telefono}
          </Text>
        </View>
      </View>

      {item.estado.toLowerCase() === "pendiente" && (
        <View style={styles.actionsContainer}>
          {onConfirm && (
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.actionButtonText}>Confirmar</Text>
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

          {onCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {item.estado.toLowerCase() === "completada" && (
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>CITA COMPLETADA</Text>
        </View>
      )}

      {item.estado.toLowerCase() === "cancelada" && (
        <View style={styles.canceledContainer}>
          <Text style={styles.canceledText}>CITA CANCELADA</Text>
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
  infoContainer: {
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
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
  completedContainer: {
    backgroundColor: "#E8F5E9",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  completedText: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  canceledContainer: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  canceledText: {
    color: "#C62828",
    fontWeight: "bold",
  },
});

export default CardCitasMedico;
