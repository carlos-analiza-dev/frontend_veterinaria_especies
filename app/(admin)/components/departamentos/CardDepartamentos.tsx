import { Departamento } from "@/core/departamentos/interfaces/response-departamentos.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { View } from "react-native";
import { Avatar, Button, Card } from "react-native-paper";

interface Props {
  depto: Departamento;
  handleEditDepto: (deptoId: string) => void;
  showModalDelete: (depto: Departamento) => void;
  showMunicipiosModal: (depto: Departamento) => void;
}

const CardDepartamentos = ({
  depto,
  handleEditDepto,
  showModalDelete,
  showMunicipiosModal,
}: Props) => {
  return (
    <Card style={{ marginBottom: 15, elevation: 3 }}>
      <Card.Title
        title={depto.nombre}
        left={(props) => (
          <Avatar.Icon
            {...props}
            icon="map-marker"
            color={depto.isActive ? "#4CAF50" : "#F44336"}
          />
        )}
        right={(props) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginRight: 10,
            }}
          >
            <Button
              onPress={() => handleEditDepto(depto.id)}
              icon="file-document-edit-outline"
              mode="text"
              compact
              labelStyle={{ fontSize: 12 }}
            >
              Editar
            </Button>
            <Button
              onPress={() => showModalDelete(depto)}
              icon={depto.isActive ? "block-helper" : "check-circle-outline"}
              mode="text"
              compact
              labelStyle={{ fontSize: 12 }}
              textColor={depto.isActive ? "#F44336" : "#4CAF50"}
            >
              {depto.isActive ? "Desactivar" : "Activar"}
            </Button>
          </View>
        )}
      />
      <Card.Content>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText
            type="default"
            style={{ color: depto.isActive ? "#4CAF50" : "#F44336" }}
          >
            {depto.isActive ? "Activo" : "Inactivo"}
          </ThemedText>

          <Button
            mode="outlined"
            onPress={() => showMunicipiosModal(depto)}
            icon="city"
            style={{ marginTop: 10 }}
          >
            Ver Municipios
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default CardDepartamentos;
