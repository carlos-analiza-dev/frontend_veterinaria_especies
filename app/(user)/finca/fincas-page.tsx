import { FAB } from "@/presentation/components/FAB";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";

import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import Buscador from "@/presentation/components/Buscador";
import MessageError from "@/presentation/components/MessageError";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import CardFincas from "./components/CardFincas";

const FincasPageGanaderos = () => {
  const { colors } = useTheme();
  const colorPrimary = useThemeColor({}, "primary");
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: fincas,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useFincasPropietarios(user?.id ?? "", debouncedSearchTerm);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!fincas || fincas.data.fincas.length === 0 || isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Buscador
          title="Buscar finca por nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
        <MessageError
          titulo="Sin fincas"
          descripcion="No se encontraron fincas disponibles en este momento"
        />
        <FAB
          iconName="add"
          onPress={() => navigation.navigate("CrearFincaPage")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedView style={styles.searchContainer}>
        <Buscador
          title="Buscar finca por nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </ThemedView>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colorPrimary]}
            tintColor={colorPrimary}
          />
        }
      >
        <ThemedText style={styles.title}>Mis Fincas</ThemedText>

        {fincas.data.fincas.map((finca) => (
          <CardFincas
            key={finca.id}
            finca={finca}
            onPress={() =>
              navigation.navigate("FincaDetailsPage", { fincaId: finca.id })
            }
          />
        ))}
      </ScrollView>

      <FAB
        iconName="add"
        onPress={() => navigation.navigate("CrearFincaPage")}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  title: {
    marginBottom: 4,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 16,
    color: "#666",
  },
  searchContainer: {
    padding: 16,
  },
});

export default FincasPageGanaderos;
