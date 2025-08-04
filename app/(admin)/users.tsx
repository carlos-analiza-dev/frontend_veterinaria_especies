import useGetRoles from "@/hooks/roles/useGetRoles";
import useGetUsersInfinityScroll from "@/hooks/users/useGetUsersInfinityScroll";
import Buscador from "@/presentation/components/Buscador";
import { FAB } from "@/presentation/components/FAB";
import MessageError from "@/presentation/components/MessageError";
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
  useWindowDimensions,
  View,
} from "react-native";

const UsersScreenAdmin = () => {
  const { width } = useWindowDimensions();
  const limit = 10;
  const colorPrimary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "icon");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const navigation = useNavigation();

  const isSmallDevice = width < 375;
  const isMediumDevice = width >= 375 && width < 414;

  const styles = createStyles(
    textColor,
    emptyTextColor,
    isSmallDevice,
    isMediumDevice
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
      <Text style={styles.title}>Gestión de Usuarios</Text>
      <View style={styles.filterContainer}>
        <Buscador
          title="Buscar por nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
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
            tintColor={colorPrimary}
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
              titulo="No se encontraron usuarios"
              descripcion="No hay usuarios disponibles para este módulo en este momento."
            />
          ) : null
        }
      />
      <FAB
        iconName="add-outline"
        onPress={() => navigation.navigate("CrearUsuario")}
        style={styles.fab}
      />
    </View>
  );
};

const createStyles = (
  textColor: string,
  emptyTextColor: string,
  isSmallDevice: boolean,
  isMediumDevice: boolean
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: isSmallDevice ? 8 : isMediumDevice ? 12 : 16,
    },
    title: {
      fontSize: isSmallDevice ? 20 : 22,
      fontWeight: "bold",
      marginVertical: isSmallDevice ? 10 : 15,
      textAlign: "center",
      color: textColor,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    listContent: {
      paddingBottom: isSmallDevice ? 60 : 80,
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
      marginBottom: isSmallDevice ? 10 : 15,
    },
    roleFilterContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: isSmallDevice ? 4 : 6,
      marginBottom: isSmallDevice ? 8 : 10,
    },
    filterButton: {
      width: isSmallDevice ? "48%" : isMediumDevice ? "31%" : "32%",
      marginBottom: isSmallDevice ? 8 : 10,
    },
    fab: {
      position: "absolute",
      margin: isSmallDevice ? 16 : 24,
      right: 0,
      bottom: 0,
    },
  });

export default UsersScreenAdmin;
