import useGetCitasByUser from "@/hooks/citas/useGetCitasByUser";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";

import { useNavigation } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import CardCitas from "./components/CardCitas";

const HomeUser = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const colorPrimary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "icon");
  const { width, height } = Dimensions.get("window");
  const userId = user?.id || "";
  const limit = 10;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: width * 0.04,
      paddingTop: height * 0.02,
    },
    title: {
      fontSize: width * 0.06,
      fontWeight: "bold",
      marginVertical: height * 0.02,
      textAlign: "center",
      color: textColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      paddingBottom: height * 0.1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: width * 0.05,
    },
    emptyText: {
      fontSize: width * 0.04,
      color: emptyTextColor,
      textAlign: "center",
    },
    footerLoader: {
      marginVertical: height * 0.03,
    },
    fabStyle: {
      position: "absolute",
      margin: width * 0.05,
      right: width * 0.02,
      bottom: height * 0.03,
    },
  });

  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasByUser(userId, limit);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Citas</Text>

      <FlatList
        data={allCitas}
        renderItem={({ item }) => (
          <View style={{ marginBottom: height * 0.015 }}>
            <CardCitas item={item} onPress={() => {}} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colorPrimary]}
            progressViewOffset={height * 0.02}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color={colorPrimary}
              style={styles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyContainer}>
              <MessageError
                titulo="No se encontraron citas"
                descripcion="No se encontraron citas para este módulo en este momento."
              />
            </View>
          ) : null
        }
      />

      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearCita")}
        style={styles.fabStyle}
      />
    </View>
  );
};

export default HomeUser;
