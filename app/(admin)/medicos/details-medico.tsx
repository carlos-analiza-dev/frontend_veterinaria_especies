import { ActualizarMedico } from "@/core/medicos/accions/update-medico";
import { CrearMedicoInterface } from "@/core/medicos/interfaces/crear-medico.interface";
import useGetMedicoById from "@/hooks/medicos/useGetMedicosById";
import useGetServiciosActivos from "@/hooks/servicios/useGetServiciosActivos";
import useGetVeterinarios from "@/hooks/users/useGetVeterinarios";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Checkbox, Switch, TextInput, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
import { ThemedText } from "../../../presentation/theme/components/ThemedText";

type RouteMedicoProps = RouteProp<UsersStackParamList, "DetailsMedico">;

interface DetailsMedicoProps {
  route: RouteMedicoProps;
}

const DetailsMedico = ({ route }: DetailsMedicoProps) => {
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const { medicoId } = route.params;
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { data: veterinarios } = useGetVeterinarios();
  const { data: categorias } = useGetServiciosActivos();
  const { data: medico, isLoading, isError } = useGetMedicoById(medicoId);
  const [selectedSubservices, setSelectedSubservices] = useState<string[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<Partial<CrearMedicoInterface>>();

  useEffect(() => {
    if (medico) {
      const subServicioIds = medico.areas_trabajo
        .filter((area) =>
          categorias?.some((cat) =>
            cat.subServicios.some((sub) => sub.id === area.id)
          )
        )
        .map((area) => area.id);
      reset({
        anios_experiencia: medico.anios_experiencia,
        areas_trabajo: subServicioIds,
        especialidad: medico.especialidad,
        numero_colegiado: medico.numero_colegiado,
        universidad_formacion: medico.universidad_formacion,
        usuarioId: medico?.usuario?.id || "",
        isActive: medico.isActive,
      });
      setSelectedSubservices(subServicioIds);
    }
  }, [medico, categorias, reset]);

  const handleSubserviceSelection = (subserviceId: string) => {
    setSelectedSubservices((prev) => {
      const newSelection = prev.includes(subserviceId)
        ? prev.filter((id) => id !== subserviceId)
        : [...prev, subserviceId];

      setValue("areas_trabajo", newSelection, { shouldValidate: true });
      return newSelection;
    });
  };

  const toggleCategoryExpand = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const veterinarios_items =
    veterinarios?.map((vet) => ({
      label: vet.name,
      value: vet.id,
    })) || [];

  const mutation_update = useMutation({
    mutationFn: (data: Partial<CrearMedicoInterface>) =>
      ActualizarMedico(medicoId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Medico actualizado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["medico-id", medicoId] }),
        queryClient.invalidateQueries({ queryKey: ["medicos"] });
      navigation.goBack();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar el médico";

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

  const onSubmit = (data: Partial<CrearMedicoInterface>) => {
    console.log("DATA", data);

    mutation_update.mutate(data);
  };

  if (isLoading) {
    return (
      <ThemedView
        style={[styles.loaderContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <MessageError
          titulo="Error al cargar el medico"
          descripcion=" No se encontraron datos del medico en este módulo. Por favor, verifica más tarde o vuelve a intentar."
        />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { minHeight: height * 0.8 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[styles.header, { backgroundColor: colors.background }]}
        >
          <ThemedText type="title" style={styles.title}>
            Detalles del Médico
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Complete todos los campos requeridos
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.card}>
          <ThemedPicker
            items={veterinarios_items}
            icon="accessibility-outline"
            selectedValue={watch("usuarioId") || ""}
            onValueChange={(text) =>
              setValue("usuarioId", text, { shouldValidate: true })
            }
            placeholder="Seleccione un veterinario*"
            error={errors.usuarioId?.message}
          />
          <TextInput
            label="Número de colegiado*"
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            value={watch("numero_colegiado")}
            maxLength={9}
            onChangeText={(text) =>
              setValue("numero_colegiado", text, { shouldValidate: true })
            }
            error={!!errors.numero_colegiado}
            left={<TextInput.Icon icon="card-account-details" />}
            theme={{ roundness: 10 }}
          />
          {errors.numero_colegiado && (
            <ThemedText style={styles.errorText}>
              {errors.numero_colegiado.message}
            </ThemedText>
          )}

          <TextInput
            label="Especialidad*"
            value={watch("especialidad")}
            onChangeText={(text) =>
              setValue("especialidad", text, { shouldValidate: true })
            }
            style={styles.input}
            mode="outlined"
            error={!!errors.especialidad}
            left={<TextInput.Icon icon="stethoscope" />}
            theme={{ roundness: 10 }}
          />
          {errors.especialidad && (
            <ThemedText style={styles.errorText}>
              {errors.especialidad.message}
            </ThemedText>
          )}

          <TextInput
            label="Universidad de formación*"
            style={styles.input}
            value={watch("universidad_formacion")}
            onChangeText={(text) =>
              setValue("universidad_formacion", text, { shouldValidate: true })
            }
            mode="outlined"
            error={!!errors.universidad_formacion}
            left={<TextInput.Icon icon="school" />}
            theme={{ roundness: 10 }}
          />
          {errors.universidad_formacion && (
            <ThemedText style={styles.errorText}>
              {errors.universidad_formacion.message}
            </ThemedText>
          )}

          <TextInput
            label="Años de experiencia*"
            style={styles.input}
            value={watch("anios_experiencia")?.toString() || ""}
            onChangeText={(text) =>
              setValue("anios_experiencia", Number(text), {
                shouldValidate: true,
              })
            }
            mode="outlined"
            keyboardType="numeric"
            error={!!errors.anios_experiencia}
            left={<TextInput.Icon icon="calendar" />}
            theme={{ roundness: 10 }}
          />
          {errors.anios_experiencia && (
            <ThemedText style={styles.errorText}>
              {errors.anios_experiencia.message}
            </ThemedText>
          )}

          <ThemedText style={styles.sectionTitle}>Áreas de trabajo*</ThemedText>
          <View style={styles.areasContainer}>
            {categorias?.map((category) => (
              <View key={category.id} style={styles.categoryContainer}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategoryExpand(category.id)}
                >
                  <ThemedText style={styles.categoryTitle}>
                    {category.nombre}
                  </ThemedText>
                  {category.subServicios.length > 0 && (
                    <FontAwesome
                      name={
                        expandedCategory === category.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>

                {expandedCategory === category.id &&
                  category.subServicios.length > 0 && (
                    <View style={styles.subservicesContainer}>
                      {category.subServicios.map((subservice) => (
                        <TouchableOpacity
                          key={subservice.id}
                          style={styles.subserviceItem}
                          onPress={() =>
                            handleSubserviceSelection(subservice.id)
                          }
                        >
                          <Checkbox
                            status={
                              selectedSubservices.includes(subservice.id)
                                ? "checked"
                                : "unchecked"
                            }
                            onPress={() =>
                              handleSubserviceSelection(subservice.id)
                            }
                            color={colors.primary}
                          />
                          <ThemedText style={styles.subserviceText}>
                            {subservice.nombre}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
              </View>
            ))}
          </View>
          {errors.areas_trabajo && (
            <ThemedText style={styles.errorText}>
              {errors.areas_trabajo.message}
            </ThemedText>
          )}
          <ThemedView style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>Activo:</ThemedText>
            <Switch
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value)}
              thumbColor={watch("isActive") ? "#4CAF50" : "#f44336"}
              trackColor={{ false: "#ccc", true: "#ccc" }}
            />
          </ThemedView>
        </ThemedView>

        <ThemedButton
          title="Actualizar Médico"
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          icon="arrow-forward-outline"
          loading={mutation_update.isPending}
          disabled={mutation_update.isPending}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 12,
    color: "#333",
  },
  areasContainer: {
    marginBottom: 5,
  },
  areasList: {
    paddingBottom: 5,
  },
  areaItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    paddingVertical: 8,
    marginRight: "4%",
  },
  areaText: {
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -8,
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 10,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginVertical: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  switchLabel: {
    fontSize: 16,
  },
  categoryContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  categoryTitle: {
    flex: 1,
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 15,
  },
  subservicesContainer: {
    paddingLeft: 40,
    backgroundColor: "#fff",
  },
  subserviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
  },
  subserviceText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#495057",
  },
});

export default DetailsMedico;
