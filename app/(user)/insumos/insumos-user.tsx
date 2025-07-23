import useGetInsumosByUser from "@/hooks/insumos/useGetInsumosByUser";
import { FAB } from "@/presentation/components/FAB";
import CardInsumos from "@/presentation/components/insumos/CardInsumos";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";

const InsumosCapexPage = () => {
  const limit = 10;
  const {
    data: insumos,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useGetInsumosByUser(limit);
  const router = useNavigation();
  const theme = useTheme();
  const primary = useThemeColor({}, "primary");

  const flattenedInsumos = insumos?.pages?.flatMap((page) => page.data) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  if (isLoading && !flattenedInsumos.length) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  if (!flattenedInsumos.length || isError) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <MessageError
          titulo="Error al cargar los insumos"
          descripcion="No se encontraron datos de insumos para este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
        <FAB
          iconName="add-outline"
          onPress={() => router.navigate("CrearInsumoPage")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={flattenedInsumos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardInsumos
            insumo={item}
            onPress={() =>
              router.navigate("DetailsInsumosPage", { insumoId: item.id })
            }
          />
        )}
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: theme.colors.background,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[primary]}
          />
        }
      />
      <FAB
        iconName="add-outline"
        onPress={() => router.navigate("CrearInsumoPage")}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    marginVertical: 20,
  },
});

export default InsumosCapexPage;
