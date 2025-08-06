import useGetMedicos from "@/hooks/medicos/useGetMedicos";
import Buscador from "@/presentation/components/Buscador";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useNavigation } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import CardMedicos from "./components/CardMedicos";

const MedicosPage = () => {
  const { colors } = useTheme();
  const limit = 10;
  const [name, setName] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigation = useNavigation();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMedicos(limit, 0, debouncedSearchTerm);

  const loadMoreMedicos = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(name);
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  const allMedicos = data?.pages.flatMap((page) => page.data) || [];

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Buscador
          title="Buscar médico por nombre..."
          setSearchTerm={setName}
          searchTerm={name}
        />
        <MessageError
          titulo="Error al cargar los medicos"
          descripcion=" No se encontraron datos de medicos en este módulo. Por favor, verifica más tarde o vuelve a intentar."
          onPress={() => onRefresh()}
        />

        <FAB
          iconName="add-outline"
          onPress={() => navigation.navigate("CrearMedicoPage")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Buscador
        title="Buscar médico por nombre..."
        setSearchTerm={setName}
        searchTerm={name}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={allMedicos}
          renderItem={({ item }) => (
            <CardMedicos
              medico={item}
              onPress={() =>
                navigation.navigate("DetailsMedico", { medicoId: item.id })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={loadMoreMedicos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => (
            <ThemedView style={styles.footer}>
              {isFetchingNextPage && <ActivityIndicator size="small" />}
              {!hasNextPage && allMedicos.length > 0 && (
                <ThemedText style={styles.noMoreText}>
                  No hay más médicos para mostrar
                </ThemedText>
              )}
            </ThemedView>
          )}
          contentContainerStyle={styles.listContent}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      )}

      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearMedicoPage")}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContent: {
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreText: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default MedicosPage;
