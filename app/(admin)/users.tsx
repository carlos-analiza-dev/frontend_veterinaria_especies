import useGetRoles from "@/hooks/roles/useGetRoles";
import useGetUsersInfinityScroll from "@/hooks/users/useGetUsersInfinityScroll";
import { FAB } from "@/presentation/components/FAB";
import UserCard from "@/presentation/components/UseCard";
import ButtonFilter from "@/presentation/theme/components/ui/ButtonFilter";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";

const UsersScreenAdmin = () => {
  const limit = 10;
  const colorPrimary = useThemeColor({}, "primary");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const emptyTextColor = useThemeColor({}, "icon");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigation = useNavigation();

  const styles = createStyles(
    backgroundColor,
    textColor,
    cardColor,
    emptyTextColor
  );

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUsersInfinityScroll(debouncedSearchTerm, roleFilter, limit);

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

  const { data: roles } = useGetRoles();

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
        <Searchbar
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          onChangeText={setSearchTerm}
          value={searchTerm}
        />

        <View style={styles.roleFilterContainer}>
          <ButtonFilter
            title="Todos"
            onPress={() => handleRoleFilter("")}
            variant={!roleFilter ? "primary" : "outline"}
            style={styles.filterButton}
          />
          {roles?.data.map((rol) => (
            <ButtonFilter
              key={rol.id}
              title={
                rol.name.charAt(0).toUpperCase() +
                rol.name.slice(1).toLowerCase()
              }
              onPress={() => handleRoleFilter(rol.name)}
              variant={roleFilter === rol.name ? "primary" : "outline"}
              style={styles.filterButton}
            />
          ))}
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

const createStyles = (
  backgroundColor: string,
  textColor: string,
  cardColor: string,
  emptyTextColor: string
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor,
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
    filterContainer: {
      marginBottom: 15,
    },
    searchInput: {
      backgroundColor: cardColor,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#ddd",
      color: textColor,
    },
    roleFilterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 10,
    },

    filterButton: {
      width: "32%",
      marginBottom: 10,
    },
  });

export default UsersScreenAdmin;
