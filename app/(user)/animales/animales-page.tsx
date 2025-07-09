import useAnimalesByPropietario from "@/hooks/animales/useAnimalesByPropietario";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import Buscador from "@/presentation/components/Buscador";
import { FAB } from "@/presentation/components/FAB";
import SelectFincas from "@/presentation/components/fincas/SelectFincas";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import AnimalCard from "./components/AnimalCard";

const AnimalesPageGanadero = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const colorPrimary = useThemeColor({}, "primary");
  const [fincaId, setFincaId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");

  const {
    data: animales,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAnimalesByPropietario(user?.id ?? "", fincaId, debouncedSearchTerm);

  const handleFincaPress = (id: string) => {
    setFincaId((prevId) => (prevId === id ? "" : id));
  };

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.filterContainer}>
          <Buscador
            title="Buscar por identificador..."
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
          <ThemedView style={styles.roleFilterContainer}>
            <SelectFincas
              fincas={fincas?.data}
              fincaId={fincaId}
              setFincaId={setFincaId}
              handleFincaPress={handleFincaPress}
            />
          </ThemedView>
        </View>
        <MessageError
          titulo="Error al cargar los animales"
          descripcion="No se encontraron animales disponibles en este momento."
        />

        <FAB
          iconName="add"
          onPress={() => navigation.navigate("CrearAnimal")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.filterContainer}>
        <Buscador
          title="Buscar por identificador..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
        <ThemedView style={styles.roleFilterContainer}>
          <SelectFincas
            fincas={fincas?.data}
            fincaId={fincaId}
            setFincaId={setFincaId}
            handleFincaPress={handleFincaPress}
          />
        </ThemedView>
      </View>
      <FlatList
        data={animales?.data || []}
        renderItem={({ item }) => (
          <AnimalCard
            animal={item}
            key={item.id}
            onPress={() =>
              navigation.navigate("AnimalDetails", { animalId: item.id })
            }
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={
          <MessageError
            titulo="Sin animales"
            descripcion="Esta finca no tiene animales registrados."
          />
        }
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefetching}
            colors={[colorPrimary]}
            tintColor={colorPrimary}
          />
        }
      />
      <FAB iconName="add" onPress={() => navigation.navigate("CrearAnimal")} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  filterContainer: {
    padding: 16,
  },

  filterButton: {
    width: "48%",
    marginBottom: 8,
  },
  filterButtonText: {
    fontSize: 12,
  },
  searchInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  roleFilterContainer: {
    width: "100%",
    marginVertical: 10,
  },
});

export default AnimalesPageGanadero;
