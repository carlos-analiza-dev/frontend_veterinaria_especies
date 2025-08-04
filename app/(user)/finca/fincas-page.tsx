import { FAB } from "@/presentation/components/FAB";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
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
  const { height, width } = Dimensions.get("window");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: width * 0.03,
    },
    scrollContainer: {
      padding: width * 0.04,
      paddingBottom: height * 0.15,
    },
    title: {
      fontSize: width * 0.05,
      fontWeight: "bold",
      marginBottom: height * 0.01,
      marginTop: height * 0.02,
    },
    searchContainer: {
      padding: width * 0.04,
      paddingBottom: height * 0.01,
    },
    cardMargin: {
      marginBottom: height * 0.02,
    },
  });

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
            progressViewOffset={height * 0.02}
          />
        }
      >
        <ThemedText style={styles.title}>Mis Fincas</ThemedText>

        {fincas.data.fincas.map((finca) => (
          <View key={finca.id} style={styles.cardMargin}>
            <CardFincas
              finca={finca}
              onPress={() =>
                navigation.navigate("FincaDetailsPage", { fincaId: finca.id })
              }
            />
          </View>
        ))}
      </ScrollView>

      <FAB
        iconName="add"
        onPress={() => navigation.navigate("CrearFincaPage")}
      />
    </ThemedView>
  );
};

export default FincasPageGanaderos;
