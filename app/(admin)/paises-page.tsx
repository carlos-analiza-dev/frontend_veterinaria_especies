import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { FAB } from "@/presentation/components/FAB";
import PaisesCard from "@/presentation/components/paises/PaisesCard";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useTheme } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const PaisesPage = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["paises"],
    queryFn: obtenerPaises,
    retry: 0,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={[styles.errorText, { color: colors.notification }]}>
          Error al cargar los países
        </ThemedText>
      </ThemedView>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText type="subtitle" style={styles.emptyText}>
          No hay países registrados
        </ThemedText>
      </ThemedView>
    );
  }

  const allCountries = data.data;

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={allCountries}
        renderItem={({ item }) => (
          <PaisesCard
            pais={item}
            onPress={() => {
              navigation.navigate("PaisDetails", { paisId: item.id });
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <ThemedText type="title" style={styles.headerTitle}>
            Lista de Países
          </ThemedText>
        }
        ListFooterComponent={<View style={styles.footer} />}
        showsVerticalScrollIndicator={false}
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearPais")}
      />
    </ThemedView>
  );
};

export default PaisesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
  },
  headerTitle: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  footer: {
    height: 40,
  },
});
