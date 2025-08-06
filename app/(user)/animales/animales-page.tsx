import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { uploadProfileImageAnimal } from "@/core/animales_profile/core/uploadProfileImageAnimal";
import useAnimalesByPropietario from "@/hooks/animales/useAnimalesByPropietario";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import Buscador from "@/presentation/components/Buscador";
import { FAB } from "@/presentation/components/FAB";
import SelectEspecies from "@/presentation/components/fincas/SelectEspecies";
import SelectFincas from "@/presentation/components/fincas/SelectFincas";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import AnimalCard from "./components/AnimalCard";

const AnimalesPageGanadero = () => {
  const { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const colorPrimary = useThemeColor({}, "primary");
  const [fincaId, setFincaId] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
      paddingHorizontal: width * 0.04,
      paddingBottom: height * 0.12,
    },
    filterContainer: {
      padding: width * 0.04,
      paddingBottom: height * 0.01,
    },
    roleFilterContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: width * 0.02,
      marginTop: height * 0.02,
    },
    pickerWrapper: {
      flex: 1,
      minHeight: height * 0.06,
    },
    cardContainer: {
      marginBottom: height * 0.02,
    },
    fabStyle: {
      position: "absolute",
      right: width * 0.05,
      bottom: height * 0.05,
      width: width * 0.14,
      height: width * 0.14,
      borderRadius: width * 0.07,
    },
  });

  const handleUpdateProfileImage = async (
    imageUri: string,
    animalId: string
  ) => {
    if (!user) return;

    try {
      await uploadProfileImageAnimal(imageUri, animalId);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");
  const { data: especies } = useGetEspecies();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useAnimalesByPropietario(
    user?.id ?? "",
    fincaId,
    especieId,
    debouncedSearchTerm
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFincaPress = (id: string) => {
    setFincaId((prevId) => (prevId === id ? "" : id));
  };

  const handleEspeciePress = (id: string) => {
    setEspecieId((prevId) => (prevId === id ? "" : id));
  };

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Animal }) => (
      <AnimalCard
        animal={item}
        onPress={() =>
          navigation.navigate("AnimalDetails", { animalId: item.id })
        }
        onUpdateProfileImage={handleUpdateProfileImage}
      />
    ),
    [navigation]
  );

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
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.filterContainer}>
          <Buscador
            title="Buscar por identificador..."
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
          <ThemedView style={styles.roleFilterContainer}>
            <View style={styles.pickerWrapper}>
              <SelectFincas
                fincas={fincas?.data}
                fincaId={fincaId}
                setFincaId={setFincaId}
                handleFincaPress={handleFincaPress}
              />
            </View>
            <View style={styles.pickerWrapper}>
              <SelectEspecies
                especies={especies?.data}
                especieId={especieId}
                setEspecieId={setEspecieId}
                handleEspeciePress={handleEspeciePress}
              />
            </View>
          </ThemedView>
        </View>
        <MessageError
          titulo="Error al cargar los animales"
          descripcion="No se encontraron animales disponibles en este momento."
          onPress={() => onRefresh()}
        />

        <FAB
          iconName="add"
          onPress={() => navigation.navigate("CrearAnimal")}
        />
      </ThemedView>
    );
  }

  const animales = data?.pages.flatMap((page) => page.data) || [];

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.filterContainer}>
        <Buscador
          title="Buscar por identificador..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
        <ThemedView style={styles.roleFilterContainer}>
          <View style={styles.pickerWrapper}>
            <SelectFincas
              fincas={fincas?.data}
              fincaId={fincaId}
              setFincaId={setFincaId}
              handleFincaPress={handleFincaPress}
            />
          </View>
          <View style={styles.pickerWrapper}>
            <SelectEspecies
              especies={especies?.data}
              especieId={especieId}
              setEspecieId={setEspecieId}
              handleEspeciePress={handleEspeciePress}
            />
          </View>
        </ThemedView>
      </View>
      <FlatList
        data={animales}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={Platform.OS === "android"}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={
          !isLoading && (
            <MessageError
              titulo="Sin animales"
              descripcion="Esta finca no tiene animales registrados."
              onPress={() => onRefresh()}
            />
          )
        }
        refreshControl={
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefetching}
            colors={[colorPrimary]}
            tintColor={colorPrimary}
            progressViewOffset={height * 0.02}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              style={{ marginVertical: height * 0.02 }}
            />
          ) : null
        }
      />

      <FAB iconName="add" onPress={() => navigation.navigate("CrearAnimal")} />
    </ThemedView>
  );
};

export default AnimalesPageGanadero;
