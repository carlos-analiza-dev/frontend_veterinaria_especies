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
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

const InsumosCapexPage = () => {
  const limit = isSmallDevice ? 8 : 10;
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
        <ActivityIndicator size={isSmallDevice ? "small" : "large"} />
      </ThemedView>
    );
  }

  if (!flattenedInsumos.length || isError) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <MessageError
          titulo="Error al cargar los insumos"
          descripcion="No se encontraron datos de insumos para este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
        <FAB
          iconName="add-outline"
          onPress={() => router.navigate("CrearInsumoPage")}
          style={styles.fab}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
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
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: theme.colors.background },
        ]}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={isSmallDevice ? 0.2 : 0.5}
        ListFooterComponent={
          isFetching ? (
            <ActivityIndicator
              size={isSmallDevice ? "small" : "large"}
              style={styles.footerLoader}
            />
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[primary]}
            progressViewOffset={isSmallDevice ? 30 : 50}
          />
        }
        initialNumToRender={isSmallDevice ? 5 : 10}
        windowSize={isSmallDevice ? 5 : 10}
      />
      <FAB
        iconName="add-outline"
        onPress={() => router.navigate("CrearInsumoPage")}
        style={styles.fab}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  errorContainer: {
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  card: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  footerLoader: {
    marginVertical: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  smallText: {
    fontSize: 14,
  },
});

export default InsumosCapexPage;
