import { ActualizarMunicipio } from "@/core/municipios/accions/update-municipio";
import { Municipio } from "@/core/municipios/interfaces/response-municipios.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
  Button,
  DataTable,
  HelperText,
  IconButton,
  Modal,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visibleMunicipiosModal: boolean;
  hideMunicipiosModal: () => void;
  selectedDepto: { id: string; nombre: string; municipios: any[] } | null;

  handleAddMunicipio: () => Promise<void>;
  newMunicipio: string;
  setNewMunicipio: React.Dispatch<React.SetStateAction<string>>;
  error: string;

  municipios: Municipio[];
  cargando: boolean;
}

const ModalAddMunicipio = ({
  hideMunicipiosModal,
  selectedDepto,
  visibleMunicipiosModal,
  handleAddMunicipio,
  newMunicipio,
  setNewMunicipio,
  error,

  municipios,
  cargando,
}: Props) => {
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");

  const queryClient = useQueryClient();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggleStatus = async (municipio: Municipio) => {
    setUpdatingId(municipio.id);
    try {
      await ActualizarMunicipio(municipio.id, {
        isActive: !municipio.isActive,
      });

      Toast.show({
        type: "success",
        text1: `Municipio ${
          !municipio.isActive ? "activado" : "desactivado"
        } exitosamente`,
      });

      queryClient.invalidateQueries({ queryKey: ["municipios-depto"] });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar el estado del municipio",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visibleMunicipiosModal}
        onDismiss={hideMunicipiosModal}
        contentContainerStyle={{
          padding: 20,
          margin: 20,
          borderRadius: 8,
          maxHeight: "80%",
          backgroundColor: colors.background,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="labelLarge">
            Municipios de {selectedDepto?.nombre}
          </Text>
          <IconButton icon="close" onPress={hideMunicipiosModal} />
        </View>

        <View style={{ marginBottom: 10 }}>
          <Button
            mode="contained"
            onPress={handleAddMunicipio}
            icon="plus"
            buttonColor={primary}
          >
            Agregar Municipio
          </Button>
          <View style={{ marginTop: 5 }}>
            <TextInput
              label="Nombre del Municipio"
              value={newMunicipio}
              onChangeText={setNewMunicipio}
              mode="outlined"
              style={{ marginTop: 15 }}
              error={!!error}
            />
            {error && <HelperText type="error">{error}</HelperText>}
          </View>
        </View>

        {cargando ? (
          <View style={{ flex: 1, justifyContent: "center", marginTop: 20 }}>
            <ActivityIndicator />
          </View>
        ) : municipios && municipios.length > 0 ? (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={{ justifyContent: "center" }}>
                Nombre
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                Estado
              </DataTable.Title>
              <DataTable.Title style={{ justifyContent: "center" }}>
                Cambiar Estado
              </DataTable.Title>
            </DataTable.Header>
            {municipios.map((municipio) => (
              <DataTable.Row key={municipio.id}>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  {municipio.nombre}
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  {updatingId === municipio.id ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Text
                      style={{
                        color: municipio.isActive ? "#4CAF50" : "#F44336",
                      }}
                    >
                      {municipio.isActive ? "Activo" : "Inactivo"}
                    </Text>
                  )}
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  {updatingId === municipio.id ? (
                    <ActivityIndicator size="small" />
                  ) : (
                    <Switch
                      value={municipio.isActive}
                      onValueChange={() => handleToggleStatus(municipio)}
                      color={municipio.isActive ? "#4CAF50" : "#F44336"}
                    />
                  )}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No hay municipios registrados
          </Text>
        )}
      </Modal>
    </Portal>
  );
};

export default ModalAddMunicipio;
