import CardService from "@/app/(admin)/servicios/components/CardService";
import useGetServiciosAdmin from "@/hooks/servicios/useGetServiciosAdmin";
import MessageError from "@/presentation/components/MessageError";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
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
import ModalAddService from "./components/ModalAddService";

const ServicioPageAdmin = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const [offset, setOffset] = useState(0);
  const [visible, setVisible] = useState(false);
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || servicios?.data.servicios.length === 0) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ThemedView style={{ padding: 10 }}>
          <ThemedButton
            title="Agregar Categoria"
            onPress={() => setVisible(true)}
            icon="add"
          />
        </ThemedView>
        <MessageError
          titulo="No se encontraron servicios"
          descripcion=" No se encontraron datos de los servicios en este módulo. Por favor, verifica más tarde o vuelve a intentar."
          onPress={() => onRefresh()}
        />
        <ModalAddService visible={visible} setVisible={setVisible} />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={{ padding: 10 }}>
        <ThemedButton
          title="Agregar Categoria"
          onPress={() => setVisible(true)}
          icon="add"
        />
      </ThemedView>
      <FlatList
        data={servicios?.data.servicios}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 40, marginTop: 10 }}>
            <CardService
              services={item}
              onPress={() =>
                navigation.navigate("AgregarSubServicio", {
                  servicioId: item.id,
                  nombre: item.nombre,
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
          />
        }
        ListHeaderComponent={
          <View>
            <ThemedText type="subtitle">Categorias</ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <ModalAddService visible={visible} setVisible={setVisible} />
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
