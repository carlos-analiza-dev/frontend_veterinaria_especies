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
  const userId = user?.id || "";
  const limit = 10;

  const styles = createStyles(textColor, emptyTextColor);

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
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Citas </Text>

      <FlatList
        data={allCitas}
        renderItem={({ item }) => <CardCitas item={item} onPress={() => {}} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[colorPrimary]}
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
            <MessageError
              titulo="No se encontraron citas"
              descripcion="No se encontraron citas para este modulo en este momento."
            />
          ) : null
        }
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearCita")}
      />
    </View>
  );
};
const createStyles = (textColor: string, emptyTextColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 15,
      textAlign: "center",
      color: textColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      paddingBottom: 20,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: emptyTextColor,
    },
    footerLoader: {
      marginVertical: 20,
    },
  });

export default HomeUser;
