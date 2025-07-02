import { ActualizarCita } from "@/core/citas/accions/update-cita";
import { EstadoCita } from "@/helpers/funciones/estadoCita";
import useGetCitasPendientesByMedico from "@/hooks/citas/useGetCitasPendientesByMedico";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import CardCitasMedico from "./components/CardCitasPendientes";

const CitasPendientesVeterinario = () => {
  const { user } = useAuthStore();
  const colorPrimary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "icon");
  const queryClient = useQueryClient();
  const userId = user?.id || "";
  const limit = 10;

  const styles = createStyles(textColor, emptyTextColor);

  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasPendientesByMedico(userId, limit);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateCitaMutation = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: string }) =>
      ActualizarCita(id, { estado }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Cita actualizada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["citas-pendientes-medico"] });
      refetch();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar la cita";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado",
          text2: "Contacte al administrador",
        });
      }
    },
  });

  const handleConfirmCita = (id: string) => {
    updateCitaMutation.mutate({ id, estado: EstadoCita.CONFIRMADA });
    queryClient.invalidateQueries({ queryKey: ["citas-pendientes-medico"] });
  };

  const handleCancelCita = (id: string) => {
    updateCitaMutation.mutate({ id, estado: EstadoCita.CANCELADA });
    queryClient.invalidateQueries({ queryKey: ["citas-pendientes-medico"] });
  };

  const handleCompleteCita = (id: string) => {
    updateCitaMutation.mutate({ id, estado: EstadoCita.COMPLETADA });
    queryClient.invalidateQueries({ queryKey: ["citas-pendientes-medico"] });
  };

  if (isLoading || updateCitaMutation.isPending) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MessageError
        titulo="No se encontraron citas"
        descripcion="No se encontraron citas para este modulo en este momento."
      />
    </ThemedView>;
  }

  const allCitas =
    citas?.pages
      .flatMap((page) => page.citas)
      .filter((cita) => cita.estado.toLowerCase() === "pendiente") || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citas</Text>

      <FlatList
        data={allCitas}
        renderItem={({ item }) => (
          <CardCitasMedico
            item={item}
            onConfirm={() => handleConfirmCita(item.id)}
            onCancel={() => handleCancelCita(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colorPrimary]}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color={colorPrimary}
              style={styles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <MessageError
              titulo="No se encontraron citas"
              descripcion="No se encontraron citas para este modulo en este momento."
            />
          ) : null
        }
      />
    </View>
  );
};

const createStyles = (textColor: string, emptyTextColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 15,
      textAlign: "center",
      color: textColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      paddingBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: emptyTextColor,
    },
    footerLoader: {
      marginVertical: 20,
    },
  });

export default CitasPendientesVeterinario;
