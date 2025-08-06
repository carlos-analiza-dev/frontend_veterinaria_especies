import useGetServiciosActivos from "@/hooks/servicios/useGetServiciosActivos";
import MessageError from "@/presentation/components/MessageError";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import CardServiceUsers from "./components/CardServiceUsers";

const ServicesUser = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");

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
          onPress={() => onRefresh()}
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
          onPress={() => onRefresh()}
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
            <ThemedText type="title" style={[styles.title, { color: primary }]}>
              Nuestros servicios
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: text }]}>
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

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    padding: windowWidth * 0.05,
    width: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    padding: windowWidth * 0.05,
    width: "100%",
  },
  listContent: {
    paddingHorizontal: windowWidth * 0.04,
    paddingBottom: windowHeight * 0.03,
    paddingTop: windowHeight * 0.02,
  },
  cardContainer: {
    marginBottom: windowHeight * 0.025,
    marginTop: windowHeight * 0.01,
    width: "100%",
  },
  header: {
    marginBottom: windowHeight * 0.02,
    alignItems: "center",
    paddingHorizontal: windowWidth * 0.02,
    width: "100%",
  },
  title: {
    marginBottom: windowHeight * 0.01,
    fontWeight: "700",
    fontSize: windowWidth * 0.06,
    textAlign: "center",
  },
  subtitle: {
    opacity: 0.8,
    textAlign: "center",
    fontSize: windowWidth * 0.035,
    lineHeight: windowHeight * 0.025,
    maxWidth: "90%",
  },
  footer: {
    height: windowHeight * 0.05,
  },
});

export default ServicesUser;
