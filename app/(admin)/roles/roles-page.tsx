import { getRolesFilters } from "@/core/roles/accions/all-roles";
import { AddRol } from "@/core/roles/accions/create-rol";
import { CreateRolI } from "@/core/roles/interfaces/crear-rol.interface";
import { ResponseRoles } from "@/core/roles/interfaces/response-roles.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import CardRoles from "./components/CardRoles";
import RoleCreationModal from "./components/RoleCreationModal";
import RoleEditModal from "./components/RoleEditModal";

const RolesPageAdmin = () => {
  const queryClient = useQueryClient();
  const primary = useThemeColor({}, "primary");
  const [modalVisible, setModalVisible] = useState(false);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [editRol, setEditRol] = useState<ResponseRoles | null>(null);
  const [newRole, setNewRole] = useState<CreateRolI>({
    name: "",
    description: "",
  });

  const {
    data: roles,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["roles", limit, offset],
    queryFn: () => getRolesFilters(limit, offset),
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });

  const mutation = useMutation({
    mutationFn: AddRol,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setModalVisible(false);
      setNewRole({ name: "", description: "" });
      Toast.show({
        type: "success",
        text1: "Rol creado exitosamente",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Error al crear el rol",
        text2: error.message,
      });
    },
  });

  const onRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar",
        text2: "No se pudieron obtener los roles",
      });
    }
  }, [refetch]);

  const handleAddRole = () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      Toast.show({
        type: "error",
        text1: "Campos requeridos",
        text2: "Nombre y descripción son obligatorios",
      });
      return;
    }
    mutation.mutate(newRole);
  };

  const handleEditRol = (rolId: string) => {
    const rol = roles?.data.roles.find((s) => s.id === rolId);
    if (rol) {
      setEditRol(rol);
      setVisibleEditModal(true);
    }
  };

  const handleInputChange = (field: keyof CreateRolI, value: string) => {
    setNewRole((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primary} />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.errorText}>
          Error al cargar los roles
        </ThemedText>
        <View style={styles.addButtonContainer}>
          <AddRoleButton
            onPress={() => setModalVisible(true)}
            color={primary}
          />
          <Button
            mode="outlined"
            onPress={onRefresh}
            style={styles.retryButton}
          >
            Reintentar
          </Button>
        </View>
        <RoleCreationModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          role={newRole}
          onChange={handleInputChange}
          onSubmit={handleAddRole}
          isLoading={mutation.isPending}
          primaryColor={primary}
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.addButtonContainer}>
        <AddRoleButton onPress={() => setModalVisible(true)} color={primary} />
      </View>

      <FlatList
        data={roles?.data.roles || []}
        renderItem={({ item }) => (
          <CardRoles
            rol={item}
            onPress={() => {}}
            handleEditRol={handleEditRol}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[primary]}
            tintColor={primary}
          />
        }
        ListHeaderComponent={
          <ThemedText type="title" style={styles.headerTitle}>
            Lista de roles
          </ThemedText>
        }
        ListEmptyComponent={
          <ThemedText type="subtitle" style={styles.emptyText}>
            No hay roles disponibles
          </ThemedText>
        }
      />

      <RoleEditModal
        visible={visibleEditModal}
        onDismiss={() => setVisibleEditModal(false)}
        roles={editRol}
        onUpdateSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
          refetch();
        }}
        primaryColor={primary}
      />

      <RoleCreationModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        role={newRole}
        onChange={handleInputChange}
        onSubmit={handleAddRole}
        isLoading={mutation.isPending}
        primaryColor={primary}
      />
    </ThemedView>
  );
};

const AddRoleButton = ({
  onPress,
  color,
}: {
  onPress: () => void;
  color: string;
}) => (
  <Button mode="contained" buttonColor={color} icon="plus" onPress={onPress}>
    Agregar Rol
  </Button>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginVertical: 20,
  },
  addButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 8,
    gap: 10,
  },

  retryButton: {
    borderColor: "#ccc",
  },
  listContent: {
    paddingBottom: 20,
  },
  headerTitle: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
  },
});

export default RolesPageAdmin;
