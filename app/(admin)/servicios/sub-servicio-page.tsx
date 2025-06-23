import { AddSubServicio } from "@/core/sub-servicio/accions/crear-sub-servicio";
import { UpdateSubServicio } from "@/core/sub-servicio/accions/update-sub-servicio";
import { CrearSubServicio } from "@/core/sub-servicio/interface/crear-sub-servicio.interface";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import useGetSubServiciosByServicioId from "@/hooks/sub-servicios/useGetSubServiciosByServicioId";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import CardSubServicios from "./components/CardSubServicios";
import ModalAddSubServices from "./components/ModalAddSubServices";

type RouteSubServicioProps = RouteProp<
  UsersStackParamList,
  "AgregarSubServicio"
>;

interface DetailsSubServicioProps {
  route: RouteSubServicioProps;
}

const SubServiciosPage = ({ route }: DetailsSubServicioProps) => {
  const { servicioId, nombre } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubServiceId, setCurrentSubServiceId] = useState("");
  const [newSubService, setNewSubService] = useState({
    nombre: "",
    descripcion: "",
    servicioId: servicioId,
    isActive: true,
  });

  const {
    data: subServicios,
    isLoading,
    isError,
    isRefetching,
    refetch,
  } = useGetSubServiciosByServicioId(servicioId);

  const { data: paises } = useGetPaisesActivos();

  const handleAddSubService = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsEditing(!isEditing);
    setNewSubService({
      nombre: "",
      descripcion: "",
      servicioId: servicioId,
      isActive: true,
    });
  };

  const updateSubServiceMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearSubServicio>;
    }) => UpdateSubServicio(id, data),
    onSuccess: () => {
      handleCloseModal();
      queryClient.invalidateQueries({
        queryKey: ["sub-servicios", servicioId],
      });
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Sub servicio actualizado exitosamente",
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de actualizar el sub servicio",
        });
      }
    },
  });

  const handleEditSubService = (subServicio: {
    id: string;
    nombre: string;
    descripcion: string;
    servicioId: string;
    isActive: boolean;
  }) => {
    setCurrentSubServiceId(subServicio.id);
    setNewSubService({
      nombre: subServicio.nombre,
      descripcion: subServicio.descripcion,
      servicioId: subServicio.servicioId,
      isActive: subServicio.isActive,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const addSubServiceMutation = useMutation({
    mutationFn: AddSubServicio,
    onSuccess: () => {
      handleCloseModal();
      queryClient.invalidateQueries({
        queryKey: ["sub-servicios", servicioId],
      });
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Sub servicio creado exitosamente",
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de crear el sub servicio",
        });
      }
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSubmit = () => {
    if (isEditing) {
      updateSubServiceMutation.mutate({
        id: currentSubServiceId,
        data: newSubService,
      });
    } else {
      addSubServiceMutation.mutate(newSubService);
    }
  };

  if (isLoading && !isRefetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.buttonWrapper}>
          <ThemedButton
            title="Agregar Servicio"
            onPress={handleAddSubService}
            icon="add"
          />
        </View>
        <ThemedText type="default" style={styles.headerText}>
          Subservicios para:{" "}
          <ThemedText type="defaultSemiBold">{nombre}</ThemedText>
        </ThemedText>
        <MessageError
          titulo="No se encontraron servicios"
          descripcion="No se encontraron datos de los servicios en este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
        <ModalAddSubServices
          visible={modalVisible}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          subService={newSubService}
          setSubService={setNewSubService}
          isSubmitting={
            addSubServiceMutation.isPending ||
            updateSubServiceMutation.isPending
          }
          isEditing={isEditing}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={subServicios?.data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <ThemedView style={{ backgroundColor: colors.background }}>
            <View style={styles.buttonWrapper}>
              <ThemedButton
                title="Agregar Servicio"
                onPress={handleAddSubService}
                icon="add"
              />
            </View>
            <ThemedText type="default" style={styles.headerText}>
              Servicios para:{" "}
              <ThemedText type="defaultSemiBold">{nombre}</ThemedText>
            </ThemedText>
          </ThemedView>
        }
        renderItem={({ item }) => (
          <CardSubServicios
            subServicio={item}
            paises={paises?.data}
            onEdit={handleEditSubService}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />

      <ModalAddSubServices
        visible={modalVisible}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        subService={newSubService}
        setSubService={setNewSubService}
        isSubmitting={
          addSubServiceMutation.isPending || updateSubServiceMutation.isPending
        }
        isEditing={isEditing}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    marginBottom: 16,
    fontSize: 18,
  },
  separator: {
    height: 16,
  },
  buttonWrapper: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
});

export default SubServiciosPage;
