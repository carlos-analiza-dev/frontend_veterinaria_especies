import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { AddServicioPrecio } from "@/core/servicios_precios/accions/crear-servicio-price";
import { ObtenerServicioPricesId } from "@/core/servicios_precios/accions/get-precios-servicio";
import { CrearServicePrecio } from "@/core/servicios_precios/interfaces/crear-servicio-precio.interface";
import { ResponseServicioPrecio } from "@/core/servicios_precios/interfaces/response-servicio-precio.interface";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card } from "react-native-paper";
import Toast from "react-native-toast-message";
import ModalAgregarPrecios from "./components/ModalAgregarPrecios";
import ModalEditServicioPrecio from "./components/ModalEditServicioPrecio";

type RouteServicioProps = RouteProp<
  UsersStackParamList,
  "AgregarPreciosServices"
>;

interface DetailsServicioProps {
  route: RouteServicioProps;
}

const AddPriceServices = ({ route }: DetailsServicioProps) => {
  const queryClient = useQueryClient();
  const { servicioId } = route.params;
  const primary = useThemeColor({}, "primary");
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [editService, setEditService] = useState<ResponseServicioPrecio | null>(
    null
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await queryClient.invalidateQueries({
      queryKey: ["servicios-precio", servicioId],
    });
    setRefreshing(false);
  };

  const [formData, setFormData] = useState<CrearServicePrecio>({
    paisId: "",
    servicioId: servicioId,
    precio: 0,
    cantidadMin: 0,
    cantidadMax: 0,
    tiempo: 0,
  });

  const {
    data: servicios,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["servicios-precio", servicioId],
    queryFn: () => ObtenerServicioPricesId(servicioId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });

  const {
    data: paises,
    isError: ErrorPais,
    isLoading: cargandoPai,
    refetch,
  } = useQuery({
    queryKey: ["paises"],
    queryFn: obtenerPaises,
    retry: 0,
  });

  const { mutate: createPrice, isPending: isCreating } = useMutation({
    mutationFn: AddServicioPrecio,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicios-precio", servicioId],
      });
      closeModal();
      Toast.show({ type: "success", text1: "Precio creados exitosamente" });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de crear el nuevo detalle del servicio",
        });
      }
    },
  });

  const openModal = () => setVisible(true);

  const closeModal = () => {
    setVisible(false);

    setFormData({
      paisId: "",
      servicioId: servicioId,
      precio: 0,
      cantidadMin: 0,
      cantidadMax: 0,
      tiempo: 0,
    });
  };

  const handleSubmit = () => {
    if (
      !formData.paisId ||
      formData.precio <= 0 ||
      formData.cantidadMin <= 0 ||
      formData.cantidadMax <= 0 ||
      formData.tiempo <= 0
    ) {
      Toast.show({ type: "error", text1: "Todos los campos son obligatorios" });
      return;
    }

    const dataToSend: CrearServicePrecio = {
      ...formData,
      precio: Number(formData.precio),
      cantidadMin: Number(formData.cantidadMin),
      cantidadMax: Number(formData.cantidadMax),
      tiempo: Number(formData.tiempo),
    };

    createPrice(dataToSend);
  };

  const handleEditServicio = (servicioId: string) => {
    const service = servicios?.data.find((s) => s.id === servicioId);
    if (service) {
      setEditService(service);
      setVisibleEditModal(true);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || servicios?.data.length === 0) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <View style={{ padding: 5, marginTop: 10, alignSelf: "flex-end" }}>
          <Button
            icon="plus"
            mode="contained"
            buttonColor={primary}
            onPress={openModal}
          >
            Agregar Precios
          </Button>
          <MessageError
            titulo="No hay precios disponibles"
            descripcion=" No se encontraron precios de servicios para este módulo. Por favor, verifica más tarde o vuelve a intentar."
          />
        </View>

        <ModalAgregarPrecios
          visible={visible}
          closeModal={closeModal}
          paises={paises?.data}
          formData={formData}
          setFormData={setFormData}
          primary={primary}
          isCreating={isCreating}
          handleSubmit={handleSubmit}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ padding: 5, marginTop: 10, alignSelf: "flex-end" }}>
        <Button
          icon="plus"
          mode="contained"
          buttonColor={primary}
          onPress={openModal}
        >
          Agregar Precios
        </Button>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ marginTop: 5, flex: 1, padding: 10 }}
      >
        {servicios?.data.map((servicio) => (
          <Card key={servicio.id} style={{ marginBottom: 15, elevation: 3 }}>
            <Card.Title
              title={servicio.pais.nombre}
              left={(props) => <Avatar.Icon {...props} icon="earth" />}
              right={(props) => (
                <Button
                  onPress={() => handleEditServicio(servicio.id)}
                  icon="pencil"
                  style={{ marginRight: 10 }}
                >
                  Editar
                </Button>
              )}
            />
            <Card.Content>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <ThemedText type="default">Precio:</ThemedText>
                <ThemedText type="defaultSemiBold">
                  {servicio.pais.simbolo_moneda}
                  {servicio.precio}
                </ThemedText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <ThemedText type="default">Cant. Mín:</ThemedText>
                <ThemedText type="defaultSemiBold">
                  {servicio.cantidadMin}
                </ThemedText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <ThemedText type="default">Cant. Máx:</ThemedText>
                <ThemedText type="defaultSemiBold">
                  {servicio.cantidadMax}
                </ThemedText>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 5,
                }}
              >
                <ThemedText type="default">Tiempo:</ThemedText>
                <ThemedText type="defaultSemiBold">
                  {servicio.tiempo} hrs
                </ThemedText>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      <ModalAgregarPrecios
        visible={visible}
        closeModal={closeModal}
        paises={paises?.data}
        formData={formData}
        setFormData={setFormData}
        primary={primary}
        isCreating={isCreating}
        handleSubmit={handleSubmit}
      />
      <ModalEditServicioPrecio
        visible={visibleEditModal}
        onDismiss={() => setVisibleEditModal(false)}
        servicio={editService}
        onUpdateSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["servicios-precio"] });
          refetch();
        }}
      />
    </ThemedView>
  );
};

export default AddPriceServices;
