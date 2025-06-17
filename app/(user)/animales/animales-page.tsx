import useAnimalesByPropietario from "@/hooks/animales/useAnimalesByPropietario";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import ButtonFilter from "@/presentation/theme/components/ui/ButtonFilter";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Searchbar, useTheme } from "react-native-paper";
import AnimalCard from "./components/AnimalCard";

const AnimalesPageGanadero = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const textColor = useThemeColor({}, "text");
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
        style={[styles.centered, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.filterContainer}>
            <Searchbar
              style={[
                styles.searchInput,
                { backgroundColor: colors.background, color: textColor },
              ]}
              placeholder="Buscar por identificador..."
              onChangeText={setSearchTerm}
              value={searchTerm}
            />
            <View style={styles.roleFilterContainer}>
              <ButtonFilter
                title="Mostrar todos"
                onPress={() => setFincaId("")}
                variant={fincaId === "" ? "primary" : "outline"}
                style={styles.filterButton}
                textStyle={styles.filterButtonText}
              />
              {fincas?.data.fincas.map((finca) => (
                <ButtonFilter
                  key={finca.id}
                  title={finca.nombre_finca}
                  onPress={() => handleFincaPress(finca.id)}
                  variant={fincaId === finca.id ? "primary" : "outline"}
                  style={styles.filterButton}
                  textStyle={styles.filterButtonText}
                />
              ))}
            </View>
          </View>
          <MessageError
            titulo="Error al cargar los animales"
            descripcion="No se encontraron animales disponibles en este momento."
          />
        </ScrollView>
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefetching}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.filterContainer}>
          <Searchbar
            style={[
              styles.searchInput,
              { backgroundColor: colors.background, color: textColor },
            ]}
            placeholder="Buscar por identificador..."
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
          <View style={styles.roleFilterContainer}>
            <ButtonFilter
              title="Mostrar todos"
              onPress={() => setFincaId("")}
              variant={fincaId === "" ? "primary" : "outline"}
              style={styles.filterButton}
              textStyle={styles.filterButtonText}
            />
            {fincas?.data.fincas.map((finca) => (
              <ButtonFilter
                key={finca.id}
                title={finca.nombre_finca}
                onPress={() => handleFincaPress(finca.id)}
                variant={fincaId === finca.id ? "primary" : "outline"}
                style={styles.filterButton}
                textStyle={styles.filterButtonText}
              />
            ))}
          </View>
        </View>

        {animales?.data.length === 0 ? (
          <MessageError
            titulo="Sin animales"
            descripcion="Esta finca no tiene animales registrados."
          />
        ) : (
          animales?.data.map((animal) => (
            <AnimalCard
              animal={animal}
              key={animal.id}
              onPress={() =>
                navigation.navigate("AnimalDetails", { animalId: animal.id })
              }
            />
          ))
        )}
      </ScrollView>
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
    marginBottom: 15,
  },
  roleFilterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
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
});

export default AnimalesPageGanadero;
