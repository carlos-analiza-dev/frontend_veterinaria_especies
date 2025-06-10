import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import { CrearServicePrecio } from "@/core/servicios_precios/interfaces/crear-servicio-precio.interface";
import { ResponseServicioPrecio } from "@/core/servicios_precios/interfaces/response-servicio-precio.interface";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import React from "react";
import { Button, Modal, Portal, TextInput, useTheme } from "react-native-paper";

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
  const { colors } = useTheme();

  const handleNumericChange = (
    text: string,
    field: keyof CrearServicePrecio
  ) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");

    if (cleanedText === "" || isNaN(Number(cleanedText))) {
      setFormData({ ...formData, [field]: 0 });
    } else {
      setFormData({ ...formData, [field]: Number(cleanedText) });
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={closeModal}
        contentContainerStyle={{
          backgroundColor: colors.background,
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
          value={formData.precio === 0 ? "" : formData.precio.toString()}
          onChangeText={(text) => handleNumericChange(text, "precio")}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Cantidad mínima animales"
          mode="outlined"
          value={
            formData.cantidadMin === 0 ? "" : formData.cantidadMin.toString()
          }
          onChangeText={(text) => handleNumericChange(text, "cantidadMin")}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Cantidad máxima animales"
          mode="outlined"
          value={
            formData.cantidadMax === 0 ? "" : formData.cantidadMax.toString()
          }
          onChangeText={(text) => handleNumericChange(text, "cantidadMax")}
          keyboardType="numeric"
          style={{ marginBottom: 10 }}
        />
        <TextInput
          label="Tiempo maximo"
          mode="outlined"
          value={formData.tiempo === 0 ? "" : formData.tiempo.toString()}
          onChangeText={(text) => handleNumericChange(text, "tiempo")}
          keyboardType="numeric"
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
