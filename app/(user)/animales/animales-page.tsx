import useAnimalesByPropietario from "@/hooks/animales/useAnimalesByPropietario";
import { useFincasPropietarios } from "@/hooks/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import ButtonFilter from "@/presentation/theme/components/ui/ButtonFilter";
import AnimalCard from "./components/AnimalCard";

import { FAB } from "@/presentation/components/FAB";
import { useNavigation } from "expo-router";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

const AnimalesPageGanadero = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const [fincaId, setFincaId] = useState("");

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");
  const {
    data: animales,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAnimalesByPropietario(user?.id ?? "", fincaId);

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
      <ThemedView style={styles.centered}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.filtersContainer}>
            {fincas && fincas.data.fincas.length > 0 && (
              <>
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
              </>
            )}
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
        <View style={styles.filtersContainer}>
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

        {animales?.data.length === 0 ? (
          <MessageError
            titulo="Sin animales"
            descripcion="Esta finca no tiene animales registrados."
          />
        ) : (
          animales?.data.map((animal) => (
            <AnimalCard animal={animal} key={animal.id} />
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
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    width: "48%",
    marginBottom: 8,
  },
  filterButtonText: {
    fontSize: 12,
  },
});

export default AnimalesPageGanadero;
