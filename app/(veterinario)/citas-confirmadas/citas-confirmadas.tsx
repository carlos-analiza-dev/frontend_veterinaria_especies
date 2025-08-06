import { ActualizarCita } from "@/core/citas/accions/update-cita";
import { EstadoCita } from "@/helpers/funciones/estadoCita";
import useGetCitasConfirmadasByMedico from "@/hooks/citas/useGetCitasConfirmadasByMedico";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import CardCitasMedico from "@/presentation/components/citas/CardCitasMedico";
import HojaRutaOptimizada from "@/presentation/components/citas/HojaRutaOptimizada";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CitasConfirmadasVeterinario = () => {
  const { user } = useAuthStore();
  const colorPrimary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "icon");
  const queryClient = useQueryClient();
  const userId = user?.id || "";
  const limit = 10;
  const [mostrarHojaRuta, setMostrarHojaRuta] = useState(false);
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 375;
  const isTablet = width >= 768;

  const getStyles = (textColor: string, emptyTextColor: string) =>
    StyleSheet.create({
      container: {
        flex: 1,
        padding: isSmallDevice ? 8 : isTablet ? 20 : 12,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      listContent: {
        paddingBottom: isTablet ? 30 : 20,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      emptyText: {
        fontSize: isSmallDevice ? 14 : 16,
        color: emptyTextColor,
        textAlign: "center",
      },
      footerLoader: {
        marginVertical: 20,
      },
      button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isSmallDevice ? 10 : isTablet ? 15 : 12,
        borderRadius: 8,
        marginBottom: isSmallDevice ? 12 : 16,
        marginHorizontal: isTablet ? width * 0.2 : 0,
      },
      buttonText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "bold",
        fontSize: isSmallDevice ? 14 : 16,
      },
      cardContainer: {
        marginHorizontal: isTablet ? width * 0.1 : 0,
      },
    });

  const currentStyles = getStyles(textColor, emptyTextColor);
  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasConfirmadasByMedico(userId, limit);

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
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Cita actualizada exitosamente",
      });

      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-confirmadas", userId, limit],
      });
      await refetch();
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

  const handleCompleteCita = (id: string) => {
    updateCitaMutation.mutate({ id, estado: EstadoCita.COMPLETADA });
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
    return (
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
          onPress={() => onRefresh()}
        />
      </ThemedView>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  if (mostrarHojaRuta) {
    return (
      <HojaRutaOptimizada
        citas={allCitas}
        onBack={() => setMostrarHojaRuta(false)}
      />
    );
  }

  return (
    <View style={currentStyles.container}>
      {allCitas && allCitas.length > 0 && (
        <TouchableOpacity
          style={[currentStyles.button, { backgroundColor: colorPrimary }]}
          onPress={() => setMostrarHojaRuta(true)}
        >
          <MaterialIcons
            name="zoom-in-map"
            size={isSmallDevice ? 18 : isTablet ? 24 : 20}
            color="white"
          />
          <Text style={currentStyles.buttonText}>Ver Ruta Optimizada</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={allCitas}
        renderItem={({ item }) => (
          <View style={currentStyles.cardContainer}>
            <CardCitasMedico
              item={item}
              onComplete={() => handleCompleteCita(item.id)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[currentStyles.listContent, { flexGrow: 1 }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colorPrimary]}
            progressViewOffset={isSmallDevice ? 30 : 0}
            enabled={true}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={Platform.select({
          ios: 0.1,
          android: 0.3,
        })}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size={isSmallDevice ? "small" : "large"}
              color={colorPrimary}
              style={currentStyles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={currentStyles.emptyContainer}>
            <MessageError
              titulo="No se encontraron citas"
              descripcion="Desliza hacia abajo para recargar"
              onPress={() => onRefresh()}
            />
          </View>
        }
      />
    </View>
  );
};

export default CitasConfirmadasVeterinario;
