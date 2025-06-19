import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import { AddServicioPrecio } from "@/core/servicios_precios/accions/crear-servicio-price";
import { updateServicioPrecio } from "@/core/servicios_precios/accions/update-servicios-price";
import { CrearServicePrecio } from "@/core/servicios_precios/interfaces/crear-servicio-precio.interface";
import { ResponseServicioPrecio } from "@/core/servicios_precios/interfaces/response-servicio-precio.interface";
import { ResponseSubServicios } from "@/core/sub-servicio/interface/obtener-sub-serviciosbyservicio.interface";
import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, List, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import ModalAgregarPrecios from "./ModalAgregarPrecios";

interface Props {
  subServicio: ResponseSubServicios;
  paises: PaisesResponse[] | undefined;
}

const CardSubServicios = ({ subServicio, paises }: Props) => {
  const primary = useThemeColor({}, "primary");
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPriceId, setCurrentPriceId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CrearServicePrecio>({
    sub_servicio_id: subServicio.id,
    paisId: "",
    precio: 0,
    tiempo: 0,
  });

  const addPriceMutation = useMutation({
    mutationFn: AddServicioPrecio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-servicios"] });
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Precio asignado correctamente",
      });
      setModalVisible(false);
    },
    onError: (error) => handleError(error, "agregar"),
  });

  const updatePriceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CrearServicePrecio }) =>
      updateServicioPrecio(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-servicios"] });
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Precio actualizado correctamente",
      });
      setModalVisible(false);
    },
    onError: (error) => handleError(error, "actualizar"),
  });

  const handleError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      if (Array.isArray(messages)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: messages.join("\n"),
        });
      } else if (typeof messages === "string") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: messages,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: `Hubo un error al ${action} el precio. Inténtalo de nuevo.`,
        });
      }
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error inesperado, contacte con el administrador",
      });
    }
  };

  const handleAddPrice = () => {
    setIsEditing(false);
    setCurrentPriceId(null);
    setFormData({
      sub_servicio_id: subServicio.id,
      paisId: "",
      precio: 0,
      tiempo: 0,
    });
    setModalVisible(true);
  };

  const handleEditPrice = (precio: ResponseServicioPrecio) => {
    setIsEditing(true);
    setCurrentPriceId(precio.id);
    setFormData({
      sub_servicio_id: subServicio.id,
      paisId: precio.pais.id,
      precio: precio.precio,
      tiempo: precio.tiempo,
    });
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (!formData.paisId || formData.precio <= 0 || formData.tiempo <= 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debe completar todos los campos correctamente",
      });
      return;
    }

    if (isEditing && currentPriceId) {
      updatePriceMutation.mutate({ id: currentPriceId, data: formData });
    } else {
      addPriceMutation.mutate(formData);
    }
  };

  return (
    <>
      <Card style={[styles.card, { backgroundColor: colors.background }]}>
        <Card.Content>
          <ThemedView
            style={[
              styles.headerContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <ThemedText style={styles.title}>{subServicio.nombre}</ThemedText>
            <ThemedView style={styles.iconContainer}>
              <MyIcon
                name="add-outline"
                onPress={handleAddPrice}
                size={20}
                color={colors.primary}
                style={styles.icon}
              />
            </ThemedView>
          </ThemedView>

          <ThemedText>{subServicio.descripcion}</ThemedText>
          <Divider
            style={[styles.divider, { backgroundColor: colors.outline }]}
          />

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Precios por país
          </ThemedText>

          {subServicio.preciosPorPais.length > 0 ? (
            subServicio.preciosPorPais.map((precio) => (
              <List.Accordion
                key={precio.id}
                title={`${precio.pais.nombre} - ${precio.pais.simbolo_moneda}${precio.precio}`}
                left={(props) => <List.Icon {...props} icon="currency-usd" />}
                style={styles.accordion}
              >
                <List.Item
                  title={`Precio: ${precio.pais.simbolo_moneda}${precio.precio}`}
                  left={() => <List.Icon icon="cash" />}
                />
                <List.Item
                  title={`Tiempo estimado: ${precio.tiempo} horas`}
                  left={() => <List.Icon icon="clock-outline" />}
                />
                <Divider style={styles.innerDivider} />
                <View style={styles.actionsContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => handleEditPrice(precio)}
                    icon="pencil"
                    style={styles.editButton}
                  >
                    Editar
                  </Button>
                </View>
              </List.Accordion>
            ))
          ) : (
            <ThemedText style={styles.emptyMessage}>
              No hay precios configurados
            </ThemedText>
          )}
        </Card.Content>
      </Card>

      <ModalAgregarPrecios
        visible={modalVisible}
        nombre={subServicio.nombre}
        closeModal={() => setModalVisible(false)}
        paises={paises}
        primary={primary}
        isCreating={addPriceMutation.isPending || updatePriceMutation.isPending}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 8,
  },
  icon: {
    margin: 0,
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
  accordion: {
    backgroundColor: "transparent",
    padding: 0,
  },
  emptyMessage: {
    textAlign: "center",
    marginVertical: 16,
    fontStyle: "italic",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    marginLeft: 8,
  },
});

export default CardSubServicios;
