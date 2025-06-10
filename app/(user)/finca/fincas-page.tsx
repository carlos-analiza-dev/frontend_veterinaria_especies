import { FAB } from "@/presentation/components/FAB";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

import { useFincasPropietarios } from "@/hooks/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import MessageError from "@/presentation/components/MessageError";
import { useNavigation } from "expo-router";
import CardFincas from "./components/CardFincas";

const FincasPageGanaderos = () => {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const navigation = useNavigation();

  const {
    data: fincas,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useFincasPropietarios(user?.id ?? "");

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator />
      </ThemedView>
    );
  }

  if (!fincas || fincas.data.fincas.length === 0 || isError) {
    return (
      <ThemedView style={styles.container}>
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
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <ThemedText style={styles.title}>Mis Fincas</ThemedText>

        {fincas.data.fincas.map((finca) => (
          <CardFincas key={finca.id} finca={finca} />
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
});

export default FincasPageGanaderos;
