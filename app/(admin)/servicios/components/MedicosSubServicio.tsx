import { Medico } from "@/core/citas/interfaces/response-citas-user.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Divider, List, useTheme } from "react-native-paper";

interface MedicosSubServicioProps {
  medicos: Medico[];
}

const MedicosSubServicio = ({ medicos }: MedicosSubServicioProps) => {
  const { colors } = useTheme();

  if (!medicos || medicos.length === 0) {
    return (
      <Card style={[styles.card, { backgroundColor: colors.background }]}>
        <Card.Content>
          <ThemedText style={styles.emptyMessage}>
            No hay médicos asignados a este subservicio
          </ThemedText>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card style={[styles.card, { backgroundColor: colors.background }]}>
      <Card.Content>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Médicos asignados ({medicos.length})
        </ThemedText>
        <Divider
          style={[styles.divider, { backgroundColor: colors.outline }]}
        />

        {medicos.map((medico) => (
          <List.Accordion
            key={medico.id}
            title={medico.usuario.name}
            description={`${medico.especialidad} - ${medico.numero_colegiado}`}
            left={(props) => <List.Icon {...props} icon="doctor" />}
            style={styles.accordion}
          >
            <List.Item
              title={`Número de colegiado: ${medico.numero_colegiado}`}
              left={() => <List.Icon icon="card-account-details" />}
            />
            <List.Item
              title={`Especialidad: ${medico.especialidad}`}
              left={() => <List.Icon icon="medical-bag" />}
            />
            <List.Item
              title={`Universidad: ${medico.universidad_formacion}`}
              left={() => <List.Icon icon="school" />}
            />
            <List.Item
              title={`Años experiencia: ${medico.anios_experiencia}`}
              left={() => <List.Icon icon="chart-line" />}
            />
            <Divider style={styles.innerDivider} />
            <List.Item
              title="Información de contacto"
              titleStyle={styles.subsectionTitle}
              left={() => <List.Icon icon="information" />}
            />
            <List.Item
              title={`Email: ${medico.usuario.email}`}
              left={() => <List.Icon icon="email" />}
            />
            <List.Item
              title={`Teléfono: ${medico.usuario.telefono}`}
              left={() => <List.Icon icon="phone" />}
            />
            <List.Item
              title={`Dirección: ${medico.usuario.direccion}`}
              left={() => <List.Icon icon="map-marker" />}
            />
          </List.Accordion>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  divider: {
    marginVertical: 12,
    height: 1,
  },
  innerDivider: {
    marginVertical: 8,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  subsectionTitle: {
    fontWeight: "bold",
    color: "#555",
  },
  accordion: {
    backgroundColor: "transparent",
    padding: 0,
    marginVertical: 4,
  },
  emptyMessage: {
    textAlign: "center",
    marginVertical: 16,
    fontStyle: "italic",
  },
});

export default MedicosSubServicio;
