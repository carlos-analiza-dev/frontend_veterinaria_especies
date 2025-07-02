import useGetServiciosActivos from "@/hooks/servicios/useGetServiciosActivos";
import MessageError from "@/presentation/components/MessageError";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import CardServiceUsers from "./components/CardServiceUsers";

const ServicesUser = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");

  const {
    data: servicios,
    isError,
    isLoading,
    refetch,
  } = useGetServiciosActivos();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.errorContainer}>
        <MessageError
          titulo="Error al cargar servicios"
          descripcion="Ocurrió un problema al obtener los servicios. Por favor, inténtalo de nuevo más tarde."
        />
      </ThemedView>
    );
  }

  if (servicios?.length === 0) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <MessageError
          titulo="No hay servicios disponibles"
          descripcion="Actualmente no hay servicios activos. Por favor, verifica más tarde."
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={servicios}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <CardServiceUsers
              services={item}
              onPress={() =>
                navigation.navigate("AgregarCitaServicio", {
                  servicioId: item.id,
                  nombre_servicio: item.nombre,
                })
              }
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[primary]}
            tintColor={primary}
            progressViewOffset={20}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Nuestros servicios
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Selecciona un servicio para agendar una cita
            </ThemedText>
          </View>
        }
        ListFooterComponent={<View style={styles.footer} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews={true}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    marginBottom: 4,
    fontWeight: "600",
  },
  subtitle: {
    color: "#666",
    textAlign: "center",
  },
  footer: {
    height: 20,
  },
});

export default ServicesUser;
