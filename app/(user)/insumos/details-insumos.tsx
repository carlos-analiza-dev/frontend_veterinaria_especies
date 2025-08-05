import { EditarInsumosByUser } from "@/core/insumos/accions/editar-insumo";
import { CrearInsumoInterface } from "@/core/insumos/interfaces/crear-insumo.interface";
import useGetInsumoById from "@/hooks/insumos/useGetInsumoById";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { Chip, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

type RouteInsumosProps = RouteProp<UsersStackParamList, "DetailsInsumosPage">;

interface EditarInsumoProps {
  route: RouteInsumosProps;
}

const DetallesInsumosPage = ({ route }: EditarInsumoProps) => {
  const { insumoId } = route.params;
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const { data: insumo, isLoading, isError } = useGetInsumoById(insumoId);
  const isSmallDevice = width < 375;
  const isLargeDevice = width >= 414;
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CrearInsumoInterface>();

  useEffect(() => {
    if (insumo) {
      reset({
        cantidadSku: insumo.cantidadSku,
        materiaPrima: insumo.materiaPrima,
        intereses: insumo.intereses,
        categorias: insumo.categorias,
        userId: user?.id || "",
      });
      setSelectedCategories(insumo.categorias);
    }
  }, [insumo]);

  const { colors } = useTheme();

  const categoriesOptions = [
    "Semillas",
    "Fertilizantes",
    "Herramientas",
    "Pesticidas",
    "Riego",
  ];

  const handleAddCategory = () => {
    if (
      newCategory.trim() &&
      !selectedCategories.includes(newCategory.trim())
    ) {
      const updatedCategories = [...selectedCategories, newCategory.trim()];
      setSelectedCategories(updatedCategories);
      setValue("categorias", updatedCategories);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const updatedCategories = selectedCategories.filter(
      (cat) => cat !== categoryToRemove
    );
    setSelectedCategories(updatedCategories);
    setValue("categorias", updatedCategories);
  };

  const mutation = useMutation({
    mutationFn: (data: CrearInsumoInterface) =>
      EditarInsumosByUser(insumoId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Insumo actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["insumos-user"] });
      router.back();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar el insumo";

        Toast.show({
          type: "error",
          text1: errorMessage,
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

  const onSubmit = (data: CrearInsumoInterface) => {
    if (!insumoId) return;
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={{ flex: 1 }}>
        <MessageError
          titulo="Error al cargar el insumo"
          descripcion="No se pudieron cargar los datos del insumo. Por favor, intente nuevamente."
        />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 80 })}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContainer,
          isSmallDevice && { paddingHorizontal: 12 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[styles.header, { backgroundColor: colors.background }]}
        >
          <ThemedText
            style={[
              styles.title,
              isSmallDevice && styles.smallTitle,
              isLargeDevice && styles.largeTitle,
            ]}
          >
            Editar Insumo
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={[
            styles.formContainer,
            isSmallDevice && styles.smallFormContainer,
          ]}
        >
          <ThemedText
            style={[
              styles.sectionTitle,
              isSmallDevice && styles.smallSectionTitle,
            ]}
          >
            Información General
          </ThemedText>

          <ThemedTextInput
            placeholder="Cantidad SKU*"
            icon="calculator-outline"
            keyboardType="numeric"
            value={watch("cantidadSku")?.toString()}
            onChangeText={(text) => {
              const num = Number(text);
              if (!isNaN(num)) setValue("cantidadSku", num);
            }}
            style={styles.input}
            error={errors.cantidadSku?.message}
          />

          <ThemedText
            style={[styles.label, isSmallDevice && styles.smallLabel]}
          >
            Categorías*
          </ThemedText>
          <View style={styles.chipsContainer}>
            {selectedCategories.map((category) => (
              <Chip
                key={category}
                style={styles.chip}
                onClose={() => handleRemoveCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </View>

          <ThemedTextInput
            placeholder="Agregar categoría"
            value={newCategory}
            onChangeText={setNewCategory}
            onSubmitEditing={handleAddCategory}
            style={[
              styles.input,
              { flex: 1 },
              isSmallDevice && { marginRight: 8 },
            ]}
          />
          <ThemedView style={styles.addInputContainer}>
            <ThemedButton
              onPress={handleAddCategory}
              icon="add-outline"
              title="Añadir"
              style={styles.addButton}
            />
          </ThemedView>

          {categoriesOptions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <ThemedText
                style={[
                  styles.suggestionsTitle,
                  isSmallDevice && styles.smallSuggestionsTitle,
                ]}
              >
                Sugerencias categorias
              </ThemedText>
              <View style={styles.suggestions}>
                {categoriesOptions.map((category) => (
                  <Chip
                    key={category}
                    mode="outlined"
                    style={[
                      styles.suggestionChip,
                      isSmallDevice && styles.smallSuggestionChip,
                      selectedCategories.includes(category) && { opacity: 0.5 },
                    ]}
                    onPress={() => {
                      if (!selectedCategories.includes(category)) {
                        const updated = [...selectedCategories, category];
                        setSelectedCategories(updated);
                        setValue("categorias", updated);
                      }
                    }}
                    disabled={selectedCategories.includes(category)}
                  >
                    {category}
                  </Chip>
                ))}
              </View>
            </View>
          )}

          <ThemedTextInput
            placeholder="Materia prima*"
            icon="leaf-outline"
            value={watch("materiaPrima")}
            onChangeText={(text) => setValue("materiaPrima", text)}
            style={styles.input}
            error={errors.materiaPrima?.message}
          />

          <ThemedTextInput
            placeholder="Intereses*"
            icon="information-outline"
            value={watch("intereses")}
            onChangeText={(text) => setValue("intereses", text)}
            style={[styles.input, styles.multilineInput]}
            multiline
            error={errors.intereses?.message}
          />

          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            icon="save-outline"
            title="Actualizar Datos"
            disabled={mutation.isPending}
          />
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  messageErrorContainer: {
    marginBottom: 20,
  },
  smallErrorText: {
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: "bold",
  },
  smallTitle: {
    fontSize: 24,
  },
  largeTitle: {
    fontSize: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  smallFormContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
    marginTop: 8,
  },
  smallSectionTitle: {
    fontSize: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#555",
  },
  smallLabel: {
    fontSize: 13,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
  },
  smallChip: {
    marginRight: 6,
    marginBottom: 6,
    height: 32,
  },
  addInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addButton: {
    height: 40,
    justifyContent: "center",
  },
  smallAddButton: {
    height: 36,
    paddingHorizontal: 12,
  },
  suggestionsContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  suggestionsTitle: {
    marginBottom: 8,
    color: "#666",
    fontSize: 14,
  },
  smallSuggestionsTitle: {
    fontSize: 13,
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    borderRadius: 8,
  },
  smallSuggestionChip: {
    height: 32,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
  },
});

export default DetallesInsumosPage;
