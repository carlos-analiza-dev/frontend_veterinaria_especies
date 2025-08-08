import { CreateCitaInsumos } from "@/core/cita-insumos/accions/crear-cita-insumos";
import { CrearCitaInsumos } from "@/core/cita-insumos/interface/crear-cita-insumo.interface";
import { ActualizarCita } from "@/core/citas/accions/update-cita";

import { Cita } from "@/core/medicos/interfaces/obtener-citas-medicos.interface";
import { Producto } from "@/core/productos/interfaces/response-productos-disponibles.interface";
import { EstadoCita } from "@/helpers/funciones/estadoCita";
import useGetCitasConfirmadasByMedico from "@/hooks/citas/useGetCitasConfirmadasByMedico";
import useGetInsumos from "@/hooks/insumos-inventario/useGetInsumos";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import CardCitasMedico from "@/presentation/components/citas/CardCitasMedico";
import HojaRutaOptimizada from "@/presentation/components/citas/HojaRutaOptimizada";
import MessageError from "@/presentation/components/MessageError";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const CitasConfirmadasVeterinario = () => {
  const { user } = useAuthStore();
  const colorPrimary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const emptyTextColor = useThemeColor({}, "icon");
  const queryClient = useQueryClient();
  const userId = user?.id || "";
  const limit = 10;
  const [mostrarHojaRuta, setMostrarHojaRuta] = useState(false);
  const { width } = Dimensions.get("window");
  const isSmallDevice = width < 375;
  const isTablet = width >= 768;

  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{
    [citaId: string]: {
      [productId: string]: { product: Producto; quantity: number };
    };
  }>({});

  const [totalAdicional, setTotalAdicional] = useState<{
    [citaId: string]: number;
  }>({});

  const handleAddProducts = (cita: Cita) => {
    setSelectedCita(cita);
    setShowProductModal(true);
  };

  const handleRemoveProduct = (productId: string) => {
    if (!selectedCita) return;

    setSelectedProducts((prev) => {
      const newProducts = { ...prev };
      if (
        newProducts[selectedCita.id] &&
        newProducts[selectedCita.id][productId]
      ) {
        const { [productId]: _, ...rest } = newProducts[selectedCita.id];
        newProducts[selectedCita.id] = rest;

        if (Object.keys(newProducts[selectedCita.id]).length === 0) {
          delete newProducts[selectedCita.id];
        }
      }
      return newProducts;
    });
  };

  const handleProductSelection = (product: Producto) => {
    if (!selectedCita) return;

    setSelectedProducts((prev) => {
      const currentCitaProducts = prev[selectedCita.id] || {};
      const newSelection = { ...prev };

      if (currentCitaProducts[product.id]) {
        const { [product.id]: _, ...rest } = currentCitaProducts;
        newSelection[selectedCita.id] = rest;
      } else {
        newSelection[selectedCita.id] = {
          ...currentCitaProducts,
          [product.id]: { product, quantity: 1 },
        };
      }

      return newSelection;
    });
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (!selectedCita || quantity < 1) return;

    setSelectedProducts((prev) => {
      const currentCitaProducts = prev[selectedCita.id] || {};
      const product = currentCitaProducts[productId]?.product;

      if (!product || quantity > product.inventario.cantidadDisponible)
        return prev;

      return {
        ...prev,
        [selectedCita.id]: {
          ...currentCitaProducts,
          [productId]: { ...currentCitaProducts[productId], quantity },
        },
      };
    });
  };

  const calculateTotal = useCallback(
    (citaId: string) => {
      if (!selectedProducts[citaId]) return 0;

      return Object.values(selectedProducts[citaId]).reduce(
        (total, { product, quantity }) => {
          return total + parseFloat(product.precio) * quantity;
        },
        0
      );
    },
    [selectedProducts]
  );

  useEffect(() => {
    if (!selectedCita) return;

    const newTotal = calculateTotal(selectedCita.id);
    setTotalAdicional((prev) => ({
      ...prev,
      [selectedCita.id]: newTotal,
    }));
  }, [selectedProducts, selectedCita, calculateTotal]);

  const handleSaveProducts = async () => {
    if (!selectedCita) return;

    try {
      if (selectedProducts[selectedCita.id]) {
        const insumosPromises = Object.values(
          selectedProducts[selectedCita.id]
        ).map(async ({ product, quantity }) => {
          const insumoData: CrearCitaInsumos = {
            citaId: selectedCita.id,
            insumoId: product.id,
            cantidad: quantity,
            precioUnitario: parseFloat(product.precio.toString()),
          };

          await CreateCitaInsumos(insumoData);
          return { success: true, productId: product.id };
        });

        await Promise.all(insumosPromises);
        queryClient.invalidateQueries({
          queryKey: ["obtener-citas-confirmadas", userId, limit],
        });
      }

      Toast.show({
        type: "success",
        text1: "Insumos agregados",
        text2: `Se agregaron insumos por un valor de ${
          user?.pais.simbolo_moneda
        }${
          selectedCita
            ? totalAdicional[selectedCita.id]?.toFixed(2) || "0.00"
            : "0.00"
        }`,
      });

      setShowProductModal(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron guardar los insumos",
      });
    }
  };

  const getStyles = (textColor: string, emptyTextColor: string) =>
    StyleSheet.create({
      container: {
        flex: 1,
        padding: isSmallDevice ? 8 : isTablet ? 20 : 12,
      },
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      listContent: {
        paddingBottom: isTablet ? 30 : 20,
      },
      emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      emptyText: {
        fontSize: isSmallDevice ? 14 : 16,
        color: emptyTextColor,
        textAlign: "center",
      },
      footerLoader: {
        marginVertical: 20,
      },
      button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: isSmallDevice ? 10 : isTablet ? 15 : 12,
        borderRadius: 8,
        marginBottom: isSmallDevice ? 12 : 16,
        marginHorizontal: isTablet ? width * 0.2 : 0,
      },
      buttonText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "bold",
        fontSize: isSmallDevice ? 14 : 16,
      },
      cardContainer: {
        marginHorizontal: isTablet ? width * 0.1 : 0,
      },
    });

  const currentStyles = getStyles(textColor, emptyTextColor);
  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasConfirmadasByMedico(userId, limit);

  const { data: productos_disponibles, refetch: refresh_products } =
    useGetInsumos();

  const onRefresh = useCallback(async () => {
    await refetch();
    await refresh_products();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateCitaMutation = useMutation({
    mutationFn: ({
      id,
      estado,
      totalFinal,
    }: {
      id: string;
      estado: string;
      totalFinal: number;
    }) => ActualizarCita(id, { estado, totalFinal }),
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Cita actualizada exitosamente",
      });

      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-confirmadas", userId, limit],
      });
      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-completadas"],
      });

      setSelectedCita(null);
      setSelectedProducts({});
      setTotalAdicional({});
      await refetch();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar la cita";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado",
          text2: "Contacte al administrador",
        });
      }
    },
  });

  const handleCompleteCita = async (id: string) => {
    const cita = allCitas.find((c) => c.id === id);
    if (!cita) return;

    const totalServicio = parseFloat(cita.totalPagar);
    const totalProductos = totalAdicional[id] || 0;
    const totalFinal = totalServicio + totalProductos;

    try {
      if (selectedProducts[id]) {
        const productosSinStock = Object.values(selectedProducts[id]).filter(
          ({ product, quantity }) =>
            quantity > product.inventario.cantidadDisponible
        );

        if (productosSinStock.length > 0) {
          const nombresProductos = productosSinStock
            .map(({ product }) => product.nombre)
            .join(", ");
          throw new Error(`No hay suficiente stock para: ${nombresProductos}`);
        }
      }

      await updateCitaMutation.mutateAsync({
        id,
        estado: EstadoCita.COMPLETADA,
        totalFinal: totalFinal,
      });
    } catch (error) {
      let errorMessage = "Error al completar la cita";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    }
  };

  if (isLoading || updateCitaMutation.isPending) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MessageError
          titulo="No se encontraron citas"
          descripcion="No se encontraron citas para este modulo en este momento."
          onPress={() => onRefresh()}
        />
      </ThemedView>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  if (mostrarHojaRuta) {
    return (
      <HojaRutaOptimizada
        citas={allCitas}
        onBack={() => setMostrarHojaRuta(false)}
      />
    );
  }

  return (
    <>
      <View style={currentStyles.container}>
        {allCitas && allCitas.length > 0 && (
          <TouchableOpacity
            style={[currentStyles.button, { backgroundColor: colorPrimary }]}
            onPress={() => setMostrarHojaRuta(true)}
          >
            <MaterialIcons
              name="zoom-in-map"
              size={isSmallDevice ? 18 : isTablet ? 24 : 20}
              color="white"
            />
            <Text style={currentStyles.buttonText}>Ver Ruta Optimizada</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={allCitas}
          renderItem={({ item }) => (
            <View style={currentStyles.cardContainer}>
              <CardCitasMedico
                item={item}
                onComplete={() => handleCompleteCita(item.id)}
                onAddProducts={() => handleAddProducts(item)}
                productosDisponibles={productos_disponibles?.insumos}
                selectedProducts={selectedProducts[item.id] || {}}
                totalAdicional={totalAdicional[item.id] || 0}
                onRemoveProduct={(productId) => {
                  setSelectedCita(item);
                  handleRemoveProduct(productId);
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[currentStyles.listContent, { flexGrow: 1 }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              colors={[colorPrimary]}
              progressViewOffset={isSmallDevice ? 30 : 0}
              enabled={true}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={Platform.select({
            ios: 0.1,
            android: 0.3,
          })}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size={isSmallDevice ? "small" : "large"}
                color={colorPrimary}
                style={currentStyles.footerLoader}
              />
            ) : null
          }
          ListEmptyComponent={
            <View style={currentStyles.emptyContainer}>
              <MessageError
                titulo="No se encontraron citas"
                descripcion="Desliza hacia abajo para recargar"
                onPress={() => onRefresh()}
              />
            </View>
          }
        />
      </View>
      <Modal
        visible={showProductModal}
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <ThemedView style={{ flex: 1, padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Seleccionar Insumos
            </Text>
            <TouchableOpacity onPress={() => setShowProductModal(false)}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {productos_disponibles?.insumos.map((producto) => {
              const isSelected =
                selectedCita &&
                selectedProducts[selectedCita.id]?.[producto.id];
              return (
                <View
                  key={producto.id}
                  style={{
                    padding: 12,
                    marginBottom: 8,
                    backgroundColor: isSelected ? "#E3F2FD" : "#FFF",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleProductSelection(producto)}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        {producto.nombre}
                      </Text>
                      <Text>
                        {producto.precio} {user?.pais.simbolo_moneda}
                      </Text>
                    </View>
                    <Text>{producto.descripcion}</Text>
                    <Text>
                      Disponibles: {producto.inventario.cantidadDisponible}{" "}
                      {producto.unidadMedida}
                    </Text>

                    {isSelected && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginTop: 8,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            updateProductQuantity(
                              producto.id,
                              selectedProducts[selectedCita.id!][producto.id]
                                .quantity - 1
                            )
                          }
                          style={{ padding: 8 }}
                        >
                          <MaterialIcons
                            name="remove"
                            size={20}
                            color="black"
                          />
                        </TouchableOpacity>

                        <Text style={{ marginHorizontal: 16 }}>
                          {
                            selectedProducts[selectedCita.id!][producto.id]
                              .quantity
                          }
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            updateProductQuantity(
                              producto.id,
                              selectedProducts[selectedCita.id!][producto.id]
                                .quantity + 1
                            )
                          }
                          style={{ padding: 8 }}
                        >
                          <MaterialIcons name="add" size={20} color="black" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
          <View
            style={{
              marginTop: 16,
              padding: 16,
              backgroundColor: "#F5F5F5",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>Resumen</Text>
            {selectedCita &&
              selectedProducts[selectedCita.id] &&
              Object.values(selectedProducts[selectedCita.id]).map(
                ({ product, quantity }) => (
                  <View
                    key={product.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text>
                      {product.nombre} x {quantity}
                    </Text>
                    <Text>
                      {(
                        parseFloat(product.precio.toString()) * quantity
                      ).toFixed(2)}{" "}
                      {user?.pais.simbolo_moneda}
                    </Text>
                  </View>
                )
              )}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#E0E0E0",
                marginTop: 8,
                paddingTop: 8,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                Total adicional:{" "}
                {selectedCita
                  ? totalAdicional[selectedCita.id]?.toFixed(2) || "0.00"
                  : "0.00"}{" "}
                {user?.pais.simbolo_moneda}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colorPrimary,
              padding: 16,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 16,
              opacity: Object.keys(selectedProducts).length > 0 ? 1 : 0.5,
            }}
            onPress={handleSaveProducts}
            disabled={Object.keys(selectedProducts).length === 0}
          >
            <Text style={{ color: "#FFF", fontWeight: "bold" }}>
              {Object.keys(selectedProducts).length > 0
                ? `Agregar ${
                    Object.keys(selectedProducts).length
                  } insumo(s) a la cita`
                : "Selecciona al menos un insumo"}
            </Text>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
    </>
  );
};

export default CitasConfirmadasVeterinario;
