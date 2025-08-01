import useGetProduccionesUserId from "@/hooks/producciones/useGetProduccionesUserId";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import ProduccionList from "@/presentation/components/produccion/ProduccionList";
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

const ProduccionGanaderoPage = () => {
  const { user } = useAuthStore();
  const userId = user?.id || "";
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: producciones,
    isError,
    isLoading,
    refetch,
  } = useGetProduccionesUserId(userId);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator size="large" color={primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <MessageError
          titulo="Error al cargar las producciones"
          descripcion=" No se encontraron datos de las producciones en este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={producciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProduccionList produccion={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <MessageError
            titulo="No hay producciones registradas"
            descripcion="No se encontraron producciones registradas. Puedes crear una nueva producción haciendo clic en el botón +"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[primary]}
            tintColor={primary}
          />
        }
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearProduccionPage")}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
});

export default ProduccionGanaderoPage;
