import useGetCitasCompletadasByMedico from "@/hooks/citas/useGetCitasCompletadasByMedico";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import CardCitasMedico from "@/presentation/components/citas/CardCitasMedico";
import HojaRutaOptimizada from "@/presentation/components/citas/HojaRutaOptimizada";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const HistorialCitasPage = () => {
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
    data: citas_completadas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasCompletadasByMedico(userId, limit);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
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

  const allCitas = citas_completadas?.pages.flatMap((page) => page.citas) || [];

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
      <FlatList
        data={allCitas}
        renderItem={({ item }) => (
          <View style={currentStyles.cardContainer}>
            <CardCitasMedico item={item} />
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

export default HistorialCitasPage;
