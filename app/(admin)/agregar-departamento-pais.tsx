import { CrearDepto } from "@/core/departamentos/accions/crear-departamento";
import { obtenerDeptosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { ActualizarDepto } from "@/core/departamentos/accions/update-depto";
import { Departamento } from "@/core/departamentos/interfaces/response-departamentos.interface";
import { CrearMunicipio } from "@/core/municipios/accions/crear-municipio";
import { obtenerMunicipiosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import MyIcon from "@/presentation/auth/components/MyIcon";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { RouteProp } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Button, DataTable, Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import ModalAddDepto from "./components/Modals/ModalAddDepto";
import ModalAddMunicipio from "./components/Modals/ModalAddMunicipio";
import ModalEditDepto from "./components/Modals/ModalEditDepto";
import ModalDeleteDepto from "./components/Modals/ModalEditStatusDepto";

type RoutePaisProps = RouteProp<UsersStackParamList, "AgregarDeptoPais">;

interface DetailsDeptoPaisProps {
  route: RoutePaisProps;
}

const ITEMS_PER_PAGE = 10;

const AgregarDepartamentoPais = ({ route }: DetailsDeptoPaisProps) => {
  const primary = useThemeColor({}, "primary");
  const queryClient = useQueryClient();
  const { paisId } = route.params;
  const [page, setPage] = useState(0);
  const [editingDepto, setEditingDepto] = useState<Departamento | null>(null);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [visibleMunicipiosModal, setVisibleMunicipiosModal] = useState(false);
  const [selectedDepto, setSelectedDepto] = useState<Departamento | null>(null);
  const [deptoToDelete, setDeptoToDelete] = useState<Departamento | null>(null);
  const [visibleAddDeptoModal, setVisibleAddDeptoModal] = useState(false);
  const [visibleModalDelete, setVisibleModalDelete] = useState(false);
  const [deptoId, setDeptoId] = useState("");
  const [newDeptoNombre, setNewDeptoNombre] = useState("");
  const [newMunicipio, setNewMunicipio] = useState("");
  const [error, setError] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["departamentos-pais", paisId],
    queryFn: () => obtenerDeptosPaisById(paisId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });

  const { data: municipios, isLoading: cargando } = useQuery({
    queryKey: ["municipios-depto", deptoId],
    queryFn: () => obtenerMunicipiosDeptoById(deptoId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });

  const departamentos = data?.data.departamentos || [];

  const from = page * ITEMS_PER_PAGE;
  const to = Math.min((page + 1) * ITEMS_PER_PAGE, departamentos.length);
  const paginatedData = departamentos.slice(from, to);

  const showMunicipiosModal = (depto: Departamento) => {
    setSelectedDepto(depto);
    setDeptoId(depto.id);
    setVisibleMunicipiosModal(true);
  };

  const hideMunicipiosModal = () => setVisibleMunicipiosModal(false);
  const showAddDeptoModal = () => setVisibleAddDeptoModal(true);

  const hideAddDeptoModal = () => {
    setVisibleAddDeptoModal(false);
    setNewDeptoNombre("");
    setError("");
  };

  const hideAddMunicipioModal = () => {
    setVisibleMunicipiosModal(false);
    setNewMunicipio("");
    setError("");
  };

  const showModalDelete = (depto: Departamento) => {
    setDeptoToDelete(depto);
    setVisibleModalDelete(true);
  };

  const hiddenModalDelete = () => {
    setVisibleModalDelete(false);
    setDeptoToDelete(null);
  };

  const handleConfirmUpdateStatus = async () => {
    if (!deptoToDelete) return;

    try {
      await ActualizarDepto(deptoToDelete.id, {
        isActive: !deptoToDelete.isActive,
      });
      Toast.show({
        type: "success",
        text1: "Departamento actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
      hiddenModalDelete();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al actualizar el departamento",
      });
    }
  };

  const handleEditDepto = (deptoId: string) => {
    const depto = departamentos.find((d) => d.id === deptoId);
    if (depto) {
      setEditingDepto(depto);
      setVisibleEditModal(true);
    }
  };

  const handleAddDepartamento = async () => {
    if (!newDeptoNombre.trim()) {
      setError("El nombre del departamento es requerido");
      return;
    }

    try {
      await CrearDepto({ nombre: newDeptoNombre, pais: paisId });

      hideAddDeptoModal();
      Toast.show({
        type: "success",
        text1: "Departamento creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
      refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de crear el departamento",
        });
      }
    }
  };

  const handleAddMunicipio = async () => {
    if (!newMunicipio.trim()) {
      setError("El nombre del municipio es requerido");
      return;
    }

    try {
      await CrearMunicipio({
        nombre: newMunicipio,
        departamento: selectedDepto?.id,
      });

      Toast.show({
        type: "success",
        text1: "Municipio creado exitosamente",
      });

      hideAddMunicipioModal();
      queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
      queryClient.invalidateQueries({ queryKey: ["municipios-depto"] });
      refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: error.response?.data
            ? error.response.data.message
            : "Ocurrio un error al momento de crear el departamento",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text variant="displaySmall">Departamentos</Text>
      </View>

      <View style={{ alignItems: "flex-end", marginTop: 5, padding: 5 }}>
        <Button
          buttonColor={primary}
          icon="plus"
          mode="contained"
          onPress={showAddDeptoModal}
        >
          Agregar Departamento
        </Button>
      </View>

      <View style={{ marginTop: 5, flex: 1 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ justifyContent: "center" }}>
              Departamento
            </DataTable.Title>

            <DataTable.Title style={{ justifyContent: "center" }}>
              Estado
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              Municipios
            </DataTable.Title>
            <DataTable.Title style={{ justifyContent: "center" }}>
              Acciones
            </DataTable.Title>
          </DataTable.Header>

          {paginatedData.map((depto) => (
            <DataTable.Row key={depto.id}>
              <DataTable.Cell style={{ justifyContent: "center" }}>
                {depto.nombre}
              </DataTable.Cell>

              <DataTable.Cell style={{ justifyContent: "center" }}>
                {depto.isActive === true ? "Activo" : "Inactivo"}
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: "center" }}>
                <Button
                  mode="outlined"
                  onPress={() => showMunicipiosModal(depto)}
                  compact
                >
                  Ver
                </Button>
              </DataTable.Cell>
              <DataTable.Cell style={{ justifyContent: "center" }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <MyIcon
                    name="pencil-outline"
                    color="black"
                    size={24}
                    onPress={() => handleEditDepto(depto.id)}
                  />
                  <MyIcon
                    name="build"
                    color="black"
                    size={24}
                    onPress={() => showModalDelete(depto)}
                  />
                </View>
              </DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(departamentos.length / ITEMS_PER_PAGE)}
            onPageChange={(newPage) => setPage(newPage)}
            label={`${from + 1}-${to} de ${departamentos.length}`}
            numberOfItemsPerPage={ITEMS_PER_PAGE}
            showFastPaginationControls
            selectPageDropdownLabel={"Filas por página"}
          />
        </DataTable>
      </View>

      <ModalAddMunicipio
        visibleMunicipiosModal={visibleMunicipiosModal}
        hideMunicipiosModal={hideMunicipiosModal}
        selectedDepto={selectedDepto}
        handleAddMunicipio={handleAddMunicipio}
        newMunicipio={newMunicipio}
        setNewMunicipio={setNewMunicipio}
        error={error}
        municipios={municipios?.data?.municipios || []}
        cargando={cargando}
      />

      <ModalAddDepto
        visibleAddDeptoModal={visibleAddDeptoModal}
        hideAddDeptoModal={hideAddDeptoModal}
        newDeptoNombre={newDeptoNombre}
        setNewDeptoNombre={setNewDeptoNombre}
        error={error}
        handleAddDepartamento={handleAddDepartamento}
      />

      <ModalDeleteDepto
        visibleModalDelete={visibleModalDelete}
        hiddenModalDelete={hiddenModalDelete}
        deptoToDelete={deptoToDelete}
        handleConfirmUpdateStatus={handleConfirmUpdateStatus}
      />

      <ModalEditDepto
        visible={visibleEditModal}
        onDismiss={() => setVisibleEditModal(false)}
        departamento={editingDepto}
        onUpdateSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
          refetch();
        }}
      />
    </ThemedView>
  );
};

export default AgregarDepartamentoPais;
