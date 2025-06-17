import useGetServiciosAdmin from "@/hooks/servicios/useGetServiciosAdmin";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import CardService from "./components/CardService";

const ServicioPageAdmin = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const primary = useThemeColor({}, "primary");

  const {
    data: servicios,
    isError,
    isLoading,
    refetch,
  } = useGetServiciosAdmin(limit, offset);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || servicios?.data.servicios.length === 0) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <MessageError
          titulo="No se encontraron servicios"
          descripcion=" No se encontraron datos de los servicios en este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
        <FAB
          iconName="add-outline"
          onPress={() => navigation.navigate("CrearServicio")}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={servicios?.data.servicios}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 40, marginTop: 10 }}>
            <CardService
              services={item}
              onPress={() => {
                navigation.navigate("DetailsServicio", { servicioId: item.id });
              }}
            />
            <View style={styles.buttonWrapper}>
              <ThemedButton
                title="Agregar Precios"
                onPress={() =>
                  navigation.navigate("AgregarPreciosServices", {
                    servicioId: item.id,
                  })
                }
              />
            </View>
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
          />
        }
        ListHeaderComponent={
          <View>
            <ThemedText type="subtitle">Lista de servicios</ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearServicio")}
      />
    </ThemedView>
  );
};

export default ServicioPageAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  buttonWrapper: {
    marginTop: 8,
    marginHorizontal: 16,
  },
});
