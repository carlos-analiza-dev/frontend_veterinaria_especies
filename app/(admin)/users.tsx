import { obtenerUsuarios } from "@/core/users/accions/obtener-usuarios";
import { FAB } from "@/presentation/components/FAB";
import UserCard from "@/presentation/components/UseCard";
import ButtonFilter from "@/presentation/theme/components/ui/ButtonFilter";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const UsersScreenAdmin = () => {
  const limit = 10;
  const colorPrimary = useThemeColor({}, "primary");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigation = useNavigation();

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["usuarios-admin", debouncedSearchTerm, roleFilter],
    queryFn: ({ pageParam = 0 }) =>
      obtenerUsuarios(
        limit,
        pageParam * limit,
        debouncedSearchTerm,
        roleFilter
      ),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.data.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
  };

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colorPrimary} />
      </View>
    );
  }

  const allUsers = data?.pages.flatMap((page) => page.data.users) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios </Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          placeholderTextColor="#999"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <View style={styles.roleFilterContainer}>
          <ButtonFilter
            title="Todos"
            onPress={() => handleRoleFilter("")}
            variant={!roleFilter ? "primary" : "outline"}
            style={styles.filterButton}
          />
          <ButtonFilter
            title="Veterinarios"
            onPress={() => handleRoleFilter("Veterinario")}
            variant={roleFilter === "Veterinario" ? "primary" : "outline"}
            style={styles.filterButton}
          />
          <ButtonFilter
            title="Secretario"
            onPress={() => handleRoleFilter("Secretario")}
            variant={roleFilter === "Secretario" ? "primary" : "outline"}
            style={styles.filterButton}
          />
          <ButtonFilter
            title="Usuarios"
            onPress={() => handleRoleFilter("User")}
            variant={roleFilter === "User" ? "primary" : "outline"}
            style={styles.filterButton}
          />
        </View>
      </View>

      <FlatList
        key={`${debouncedSearchTerm}-${roleFilter}`}
        data={allUsers}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() =>
              navigation.navigate("UserDetails", { userId: item.id })
            }
          />
        )}
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
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay usuarios registrados</Text>
            </View>
          ) : null
        }
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearUsuario")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    textAlign: "center",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
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
    color: "#666",
  },
  footerLoader: {
    marginVertical: 20,
  },
  filterContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: "white",
    padding: Platform.OS === "ios" ? 12 : 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  roleFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default UsersScreenAdmin;
