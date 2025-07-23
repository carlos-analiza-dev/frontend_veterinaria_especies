import { Analisis } from "@/core/analisis_suelo/interface/response-analisis-suelo.interface";
import useGetAnalisisSuelo from "@/hooks/analisis_suelo/useGetAnalisisSuelo";
import CardAnalisisSuelo from "@/presentation/components/analisis_suelo/CardAnalisisSuelo";
import ModalAgregarAnalisis from "@/presentation/components/analisis_suelo/ModalAgregarAnalisis";
import MessageError from "@/presentation/components/MessageError";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";

const AnalisisEficienciaPage = () => {
  const theme = useTheme();
  const limit = 10;
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);

  const [editingAnalisis, setEditingAnalisis] = useState<Analisis | null>(null);
  const hideModal = () => {
    setVisible(false);
    setEditingAnalisis(null);
  };
  const handleEdit = (analisis: Analisis) => {
    setEditingAnalisis(analisis);
    setVisible(true);
  };
  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetAnalisisSuelo(limit);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allAnalisis = data?.pages.flatMap((page) => page.data.data) || [];

  if (isLoading && !isRefetching) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <ThemedButton
          icon="add-outline"
          onPress={showModal}
          style={styles.addButton}
          title="Agregar Análisis"
        />

        <MessageError
          titulo="Error al cargar análisis"
          descripcion="Ocurrió un problema al cargar los análisis de suelo. Por favor intente nuevamente."
        />
        <ThemedButton
          icon="refresh"
          onPress={() => refetch()}
          style={styles.retryButton}
          title="Reintentar"
        />
        <ModalAgregarAnalisis visible={visible} hideModal={hideModal} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Análisis de Suelo
        </ThemedText>
        <ThemedButton
          icon="add-outline"
          onPress={showModal}
          style={styles.addButton}
          title="Nuevo Análisis"
        />
      </ThemedView>

      <FlatList
        data={allAnalisis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardAnalisisSuelo analisis={item} handleEdit={handleEdit} />
        )}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={styles.footerLoader} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageError
              titulo="No hay análisis registrados"
              descripcion="No se encontraron análisis de suelo para mostrar."
            />
            <ThemedButton
              icon="add-outline"
              onPress={showModal}
              style={styles.emptyButton}
              title="Crear Primer Análisis"
            />
          </View>
        }
      />
      <ModalAgregarAnalisis
        visible={visible}
        hideModal={hideModal}
        editingAnalisis={editingAnalisis}
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
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  addButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  listContainer: {
    padding: 8,
  },
  card: {
    marginBottom: 12,
  },
  footerLoader: {
    marginVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyButton: {
    marginTop: 24,
    borderRadius: 8,
  },
  retryButton: {
    marginTop: 16,
    borderRadius: 8,
  },
});

export default AnalisisEficienciaPage;
