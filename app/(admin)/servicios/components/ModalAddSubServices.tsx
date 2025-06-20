import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import {
  Button,
  Card,
  Modal,
  Portal,
  TextInput,
  useTheme,
} from "react-native-paper";

interface ModalAddSubServicesProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  subService: {
    nombre: string;
    descripcion: string;
    servicioId: string;
    isActive: boolean;
  };
  setSubService: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      descripcion: string;
      servicioId: string;
      isActive: boolean;
    }>
  >;
  isSubmitting: boolean;
  isEditing: boolean;
}

const ModalAddSubServices: React.FC<ModalAddSubServicesProps> = ({
  visible,
  onClose,
  onSubmit,
  subService,
  setSubService,
  isSubmitting,
  isEditing,
}) => {
  const theme = useTheme();
  const primary = useThemeColor({}, "primary");

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          padding: 16,
          margin: 20,
        }}
      >
        <Card style={{ backgroundColor: theme.colors.background }}>
          <Card.Content>
            <ThemedText
              type="defaultSemiBold"
              style={{
                marginBottom: 24,
                textAlign: "center",
                color: primary,
              }}
            >
              {isEditing ? "Editar Servicio" : "Agregar Servicio"}
            </ThemedText>

            <TextInput
              label="Nombre del subservicio"
              value={subService.nombre}
              onChangeText={(text) =>
                setSubService({ ...subService, nombre: text })
              }
              mode="outlined"
              style={{ marginBottom: 16 }}
              placeholder="Ej: Inseminación Artificial"
              left={<TextInput.Icon icon="tag" />}
            />

            <TextInput
              label="Descripción"
              value={subService.descripcion}
              onChangeText={(text) =>
                setSubService({ ...subService, descripcion: text })
              }
              mode="outlined"
              style={{ marginBottom: 24, height: 100 }}
              placeholder="Descripción detallada del subservicio..."
              left={<TextInput.Icon icon="text" />}
            />

            <Card.Actions style={{ justifyContent: "space-between" }}>
              <Button
                mode="outlined"
                onPress={onClose}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={onSubmit}
                disabled={isSubmitting}
                style={{ flex: 1, marginLeft: 8 }}
                buttonColor={primary}
              >
                {isEditing ? "Editar" : "Guardar"}
              </Button>
            </Card.Actions>
          </Card.Content>
        </Card>
      </Modal>
    </Portal>
  );
};

export default ModalAddSubServices;
