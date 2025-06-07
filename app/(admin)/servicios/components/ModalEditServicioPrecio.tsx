import { updateServicioPrecio } from "@/core/servicios_precios/accions/update-servicios-price";
import { ResponseServicioPrecio } from "@/core/servicios_precios/interfaces/response-servicio-precio.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import Toast from "react-native-toast-message";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  servicio: ResponseServicioPrecio | null;
  onUpdateSuccess: () => void;
}

const ModalEditServicioPrecio = ({
  onDismiss,
  onUpdateSuccess,
  servicio,
  visible,
}: Props) => {
  const primary = useThemeColor({}, "primary");
  const [precio, setPrecio] = useState<number>(servicio?.precio || 0);
  const [cantidadMax, setCantidadMax] = useState<number>(
    servicio?.cantidadMax || 0
  );
  const [cantidadMin, setCantidadMin] = useState<number>(
    servicio?.cantidadMin || 0
  );
  const [tiempo, setTiempo] = useState<number>(servicio?.tiempo || 0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (servicio) {
      const precioUp = Number(servicio.precio);
      setPrecio(precioUp);
      setCantidadMax(servicio.cantidadMax);
      setCantidadMin(servicio.cantidadMin);
      setTiempo(servicio.tiempo);
    }
  }, [servicio]);

  const handleSubmit = async () => {
    if (isNaN(precio) || precio <= 0) {
      setError("El precio debe ser un número válido mayor a 0");
      return;
    }

    if (isNaN(cantidadMin) || cantidadMin < 0) {
      setError("La cantidad mínima debe ser un número válido");
      return;
    }

    if (isNaN(cantidadMax) || cantidadMax < 0) {
      setError("La cantidad máxima debe ser un número válido");
      return;
    }

    if (isNaN(tiempo) || tiempo <= 0) {
      setError("El tiempo debe ser un número válido mayor a 0");
      return;
    }

    if (!servicio) return;

    setIsLoading(true);
    try {
      await updateServicioPrecio(servicio.id, {
        precio: Number(precio),
        cantidadMin: Number(cantidadMin),
        cantidadMax: Number(cantidadMax),
        tiempo: Number(tiempo),
      });
      queryClient.invalidateQueries({ queryKey: ["servicios-precio"] });
      Toast.show({
        type: "success",
        text1: "Servicio actualizado exitosamente",
      });

      onUpdateSuccess();
      onDismiss();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar el servicio",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 8,
        }}
      >
        <Text>Editar Servicio - Precios</Text>

        <TextInput
          label="Precio"
          value={String(precio)}
          onChangeText={(text) => {
            setPrecio(Number(text));
            setError("");
          }}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginTop: 15 }}
          error={!!error}
        />
        {error && <HelperText type="error">{error}</HelperText>}

        <TextInput
          label="Cantidad mínima animales"
          value={String(cantidadMin)}
          onChangeText={(text) => {
            setCantidadMin(Number(text));
            setError("");
          }}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginTop: 15 }}
          error={!!error}
        />
        {error && <HelperText type="error">{error}</HelperText>}

        <TextInput
          label="Cantidad máxima animales"
          value={String(cantidadMax)}
          onChangeText={(text) => {
            setCantidadMax(Number(text));
            setError("");
          }}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginTop: 15 }}
          error={!!error}
        />
        {error && <HelperText type="error">{error}</HelperText>}

        <TextInput
          label="Tiempo hrs"
          value={String(tiempo)}
          onChangeText={(text) => {
            setTiempo(Number(text));
            setError("");
          }}
          mode="outlined"
          keyboardType="numeric"
          style={{ marginTop: 15 }}
          error={!!error}
        />
        {error && <HelperText type="error">{error}</HelperText>}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={{ marginRight: 10 }}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            buttonColor={primary}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
          >
            Editar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalEditServicioPrecio;
