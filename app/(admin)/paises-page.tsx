import usePaises from "@/hooks/paises/usePaises";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import PaisesCard from "@/presentation/components/paises/PaisesCard";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useTheme } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";

const PaisesPage = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const colorPrimary = useThemeColor({}, "primary");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isError, isLoading, refetch } = usePaises();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <MessageError
          titulo="Error al cargar los paises"
          descripcion=" No se encontraron datos de paises en este módulo. Por favor, verifica más tarde o vuelve a intentar."
          onPress={() => onRefresh()}
        />

        <FAB
          iconName="add-outline"
          onPress={() => navigation.navigate("CrearPais")}
        />
      </ThemedView>
    );
  }

  const allCountries = data?.data;

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={allCountries}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <PaisesCard
              pais={item}
              onPress={() => {
                navigation.navigate("PaisDetails", { paisId: item.id });
              }}
            />

            <View style={styles.buttonWrapper}>
              <ThemedButton
                title="Agregar Departamento"
                onPress={() =>
                  navigation.navigate("AgregarDeptoPais", { paisId: item.id })
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
            colors={[colorPrimary]}
            tintColor={colorPrimary}
          />
        }
        ListHeaderComponent={
          <ThemedText type="title" style={styles.headerTitle}>
            Lista de Países
          </ThemedText>
        }
        ListFooterComponent={<View style={styles.footer} />}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearPais")}
      />
    </ThemedView>
  );
};

export default PaisesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.6,
  },
  headerTitle: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  footer: {
    height: 40,
  },
  itemContainer: {
    marginBottom: 12,
  },
  buttonWrapper: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagImage: {
    width: 32,
    height: 24,
    marginRight: 10,
    marginLeft: 16,
    borderRadius: 4,
  },
});
