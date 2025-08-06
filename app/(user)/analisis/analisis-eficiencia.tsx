import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

import { Analisis } from "@/core/analisis_suelo/interface/response-analisis-suelo.interface";
import useGetAnalisisSuelo from "@/hooks/analisis_suelo/useGetAnalisisSuelo";
import CardAnalisisSuelo from "@/presentation/components/analisis_suelo/CardAnalisisSuelo";
import ModalAgregarAnalisis from "@/presentation/components/analisis_suelo/ModalAgregarAnalisis";
import MessageError from "@/presentation/components/MessageError";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";

const AnalisisEficienciaPage = () => {
  const { width } = useWindowDimensions();
  const isTiny = width < 350;
  const isSmall = width < 400;
  const isLarge = width >= 430;

  const limit = 10;
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [editingAnalisis, setEditingAnalisis] = useState<Analisis | null>(null);

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

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setEditingAnalisis(null);
  };
  const handleEdit = (analisis: Analisis) => {
    setEditingAnalisis(analisis);
    setVisible(true);
  };
  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const allAnalisis = data?.pages.flatMap((p) => p.data.data) ?? [];

  if (isLoading && !isRefetching) {
    return (
      <View
        style={[styles.center, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.flex}>
        <Header
          onPressAdd={showModal}
          isSmall={isSmall}
          isTiny={isTiny}
          isLarge={isLarge}
        />
        <MessageError
          titulo="Error al cargar análisis"
          descripcion="Ocurrió un problema al cargar los análisis de suelo. Por favor intente nuevamente."
          onPress={() => onRefresh()}
        />
        <ThemedButton
          icon="refresh"
          onPress={refetch}
          style={styles.retryBtn}
          title="Reintentar"
        />
        <ModalAgregarAnalisis visible={visible} hideModal={hideModal} />
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <Header
        onPressAdd={showModal}
        isSmall={isSmall}
        isTiny={isTiny}
        isLarge={isLarge}
      />

      <FlatList
        data={allAnalisis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardAnalisisSuelo analisis={item} handleEdit={handleEdit} />
        )}
        contentContainerStyle={{
          paddingHorizontal: isTiny ? 8 : isLarge ? 20 : 12,
          paddingBottom: 24,
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.15}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={
              Platform.OS === "android" ? [theme.colors.primary] : undefined
            }
            tintColor={theme.colors.primary}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MessageError
              titulo="No hay análisis registrados"
              descripcion="No se encontraron análisis de suelo para mostrar."
              onPress={() => onRefresh()}
            />
            <ThemedButton
              icon="add-outline"
              onPress={showModal}
              style={styles.emptyBtn}
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
    </SafeAreaView>
  );
};

const Header = ({
  onPressAdd,
  isSmall,
  isTiny,
  isLarge,
}: {
  onPressAdd: () => void;
  isSmall: boolean;
  isTiny: boolean;
  isLarge: boolean;
}) => (
  <ThemedView
    style={{
      paddingVertical: isTiny ? 8 : 12,
      paddingHorizontal: isTiny ? 12 : isLarge ? 24 : 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: "#cfd0d0",
    }}
  >
    <ThemedText
      type="title"
      style={{
        fontSize: isTiny ? 20 : isSmall ? 22 : 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: isTiny ? 8 : 12,
      }}
    >
      Análisis de Suelo
    </ThemedText>

    <ThemedButton
      icon="add-outline"
      onPress={onPressAdd}
      style={{ borderRadius: 8, alignSelf: "center" }}
      title="Nuevo Análisis"
    />
  </ThemedView>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyBtn: { marginTop: 24, borderRadius: 8 },

  retryBtn: { marginTop: 16, borderRadius: 8 },
});

export default AnalisisEficienciaPage;
