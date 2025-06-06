import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import { CrearServicePrecio } from "@/core/servicios_precios/interfaces/crear-servicio-precio.interface";
import { ResponseServicioPrecio } from "@/core/servicios_precios/interfaces/response-servicio-precio.interface";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import React from "react";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

interface Props {
  visible: boolean;
  closeModal: () => void;
  paises: PaisesResponse[] | undefined;
  formData: CrearServicePrecio;
  primary: string;
  isCreating: boolean;
  handleSubmit: () => void;
  setFormData: React.Dispatch<React.SetStateAction<CrearServicePrecio>>;
  servicio?: ResponseServicioPrecio | null;
}

const ModalAgregarPrecios = ({
  visible,
  primary,
  paises,
  isCreating,
  handleSubmit,
  formData,
  closeModal,
  setFormData,
}: Props) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 10,
        }}
      >
        <ThemedPicker
          items={
            paises?.map((pais) => ({
              label: pais.nombre,
              value: pais.id,
            })) || []
          }
          selectedValue={formData.paisId}
          onValueChange={(value) => setFormData({ ...formData, paisId: value })}
          placeholder="Seleccionar país"
          icon="earth"
        />

        <TextInput
          label="Precio"
          mode="outlined"
          value={formData.precio.toString()}
          onChangeText={(text) =>
            setFormData({ ...formData, precio: text ? Number(text) : 0 })
          }
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Cantidad mínima"
          mode="outlined"
          value={formData.cantidadMin.toString()}
          onChangeText={(text) =>
            setFormData({ ...formData, cantidadMin: text ? Number(text) : 0 })
          }
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Cantidad máxima"
          mode="outlined"
          value={formData.cantidadMax.toString()}
          onChangeText={(text) =>
            setFormData({ ...formData, cantidadMax: text ? Number(text) : 0 })
          }
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Tiempo maximo"
          mode="outlined"
          value={formData.tiempo.toString()}
          onChangeText={(text) =>
            setFormData({ ...formData, tiempo: text ? Number(text) : 0 })
          }
          style={{ marginBottom: 10 }}
        />
        <Button
          mode="contained"
          buttonColor={primary}
          loading={isCreating}
          disabled={isCreating}
          onPress={handleSubmit}
        >
          Guardar
        </Button>
      </Modal>
    </Portal>
  );
};

export default ModalAgregarPrecios;
