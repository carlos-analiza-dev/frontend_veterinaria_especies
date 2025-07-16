import { ActualizarAnimal } from "@/core/animales/accions/update-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { complementosOptions } from "@/helpers/data/complementos";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { extractNumberFromIdentifier } from "@/helpers/funciones/extractNumberFromIdentifier ";
import useAnimalById from "@/hooks/animales/useAnimalById";

import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedMultiPicker from "@/presentation/theme/components/ThemedMultiPicker";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Checkbox, Switch, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

type RouteAnimalProps = RouteProp<UsersStackParamList, "AnimalDetails">;

interface EditarAnimalProps {
  route: RouteAnimalProps;
}

const AnimalDetailsPage = ({ route }: EditarAnimalProps) => {
  const { animalId } = route.params;
  const { user } = useAuthStore();
  const navigation = useNavigation();
  const userId = user?.id;
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelp1, setShowIdentifierHelp1] = useState(false);
  const [showIdentifierHelp2, setShowIdentifierHelp2] = useState(false);
  const [especieId, setEspecieId] = useState("");
  const [expandedAlimento, setExpandedAlimento] = useState<string | null>(null);
  const [tipoAlimentacion, setTipoAlimentacion] = useState<
    { alimento: string; origen: string }[]
  >([]);
  const [complementoSeleccionados, setComplementoSeleccionados] = useState<
    string[]
  >([]);

  const toggleAlimentoExpand = (alimento: string) => {
    setExpandedAlimento((prev) => (prev === alimento ? null : alimento));
  };

  const handleOrigenSelection = (alimento: string, origen: string) => {
    const updated = [...tipoAlimentacion];
    const index = updated.findIndex((item) => item.alimento === alimento);

    if (index !== -1) {
      updated[index].origen = origen;
    } else {
      updated.push({ alimento, origen });
    }

    setTipoAlimentacion(updated);
    setValue("tipo_alimentacion", updated);
  };

  const isAlimentoSeleccionado = (alimento: string) => {
    return tipoAlimentacion.some((a) => a.alimento === alimento);
  };
  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<
    Partial<
      CrearAnimalByFinca & {
        identificador_temp: string;
        identificador_temp_padre: string;
        identificador_temp_madre: string;
      }
    >
  >();

  const { data: animalData } = useAnimalById(animalId);

  useEffect(() => {
    if (animalData?.data) {
      const animal = animalData.data;

      reset({
        especie: animal?.especie?.id || "",
        sexo: animal?.sexo || "",
        color: animal?.color || "",
        identificador_temp: extractNumberFromIdentifier(animal?.identificador),
        identificador_temp_madre: extractNumberFromIdentifier(
          animal?.arete_madre ?? ""
        ),
        identificador_temp_padre: extractNumberFromIdentifier(
          animal?.arete_padre ?? ""
        ),
        identificador: animal?.identificador || "",
        arete_madre: animal?.arete_madre || "",
        arete_padre: animal?.arete_padre || "",
        razaIds: animal?.razas?.map((raza) => raza.id) || [],
        pureza: animal?.pureza,
        edad_promedio: Number(animal?.edad_promedio) || 0,
        fecha_nacimiento: animal?.fecha_nacimiento || "",
        castrado: animal?.castrado || false,
        esterelizado: animal?.esterelizado || false,
        observaciones: animal?.observaciones || "",
        fincaId: animal?.finca?.id || "",
        propietarioId: animal?.propietario?.id || "",
        medicamento: animal?.medicamento || "",
        tipo_alimentacion: animal?.tipo_alimentacion || "",
        nombre_padre: animal?.nombre_padre || "",
        razas_padre: animal?.razas_padre?.map((raza) => raza.id) || [],
        pureza_padre: animal?.pureza_padre,
        nombre_criador_padre: animal?.nombre_criador_padre || "",
        nombre_propietario_padre: animal?.nombre_propietario_padre || "",
        nombre_finca_origen_padre: animal?.nombre_finca_origen_padre || "",
        compra_padre: animal?.compra_padre || false,
        nombre_criador_origen_padre: animal?.nombre_criador_origen_padre || "",

        nombre_madre: animal?.nombre_madre || "",
        razas_madre: animal?.razas_madre?.map((raza) => raza.id) || [],
        pureza_madre: animal?.pureza_madre,
        nombre_criador_madre: animal?.nombre_criador_madre || "",
        nombre_propietario_madre: animal?.nombre_propietario_madre || "",
        nombre_finca_origen_madre: animal?.nombre_finca_origen_madre || "",
        numero_parto_madre: animal?.numero_parto_madre || 0,
        compra_madre: animal?.compra_madre || false,
        nombre_criador_origen_madre: animal?.nombre_criador_origen_madre || "",
      });

      if (animal?.tipo_alimentacion) {
        setTipoAlimentacion(animal.tipo_alimentacion);
      }

      if (animal?.complementos) {
        const complementos = animal.complementos.map((c) => c.complemento);
        setComplementoSeleccionados(complementos);
      }

      if (animal?.especie?.id) {
        setEspecieId(animal.especie.id);
      }
    }
  }, [animalData, reset]);

  const { data: especies } = useGetEspecies();

  useEffect(() => {
    if (animalData?.data) {
      setEspecieId(animalData.data.especie.id);
    }
  }, [animalData]);

  const { data: razas } = useGetRazasByEspecie(especieId);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setValue("fecha_nacimiento", selectedDate.toISOString().split("T")[0]);
    }
  };

  const { data: fincas } = useFincasPropietarios(userId ?? "");

  const especiesItems =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
  }));

  const selectedSexo = watch("sexo");

  useEffect(() => {
    if (selectedSexo === "Macho") {
      setValue("esterelizado", false);
    } else if (selectedSexo === "Hembra") {
      setValue("castrado", false);
    }
  }, [selectedSexo, setValue]);

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const handleAlimentoChange = (alimento: string) => {
    const nuevosComplementos = [...complementoSeleccionados];
    if (nuevosComplementos.includes(alimento)) {
      const index = nuevosComplementos.indexOf(alimento);
      nuevosComplementos.splice(index, 1);
    } else {
      nuevosComplementos.push(alimento);
    }
    setComplementoSeleccionados(nuevosComplementos);
    setValue(
      "complementos",
      nuevosComplementos.map((a) => ({ complemento: a }))
    );
  };
  const getIdentifierPrefix = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIds: string[] = watch("razaIds") || [];
    const sexo = watch("sexo");

    if (!especie || !razaIds || razaIds.length === 0 || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIds
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    const sexoCode = sexo === "Macho" ? "1" : "2";

    return `${especieCode}${combinedRazaCode}${sexoCode}`;
  };

  const getIdentifierPrefixPadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIdsPadre: string[] = watch("razas_padre") || [];
    const sexo = "1";

    if (!especie || !razaIdsPadre || razaIdsPadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsPadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const getIdentifierPrefixMadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIdsMadre: string[] = watch("razas_madre") || [];
    const sexo = "2";

    if (!especie || !razaIdsMadre || razaIdsMadre.length === 0) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();

    const razaCodes = razaIdsMadre
      .map((id) =>
        razas?.data.find((r) => r.id === id)?.abreviatura?.toUpperCase()
      )
      .filter(Boolean);

    if (razaCodes.length === 0) return null;

    const combinedRazaCode =
      razaCodes.length === 1 ? razaCodes[0] : `${razaCodes[0]}${razaCodes[1]}`;

    return `${especieCode}${combinedRazaCode}${sexo}`;
  };

  const formatNumber = (num: string) => {
    return num.padStart(6, "0");
  };

  const handleIdentifierChange = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);

    setValue("identificador_temp", numbersOnly);

    const prefix = getIdentifierPrefix();
    if (prefix && numbersOnly.length === 6) {
      setValue("identificador", `${prefix}-${numbersOnly}`);
    }
  };

  const handleIdentifierChangePadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);

    setValue("identificador_temp_padre", numbersOnly);

    const prefix = getIdentifierPrefixPadre();
    if (prefix && numbersOnly.length === 6) {
      setValue("arete_padre", `${prefix}-${formatNumber(numbersOnly)}`);
    }
  };

  const handleIdentifierChangeMadre = (input: string) => {
    const numbersOnly = input.replace(/\D/g, "").slice(0, 6);

    setValue("identificador_temp_madre", numbersOnly);

    const prefix = getIdentifierPrefixMadre();
    if (prefix && numbersOnly.length === 6) {
      setValue("arete_madre", `${prefix}-${formatNumber(numbersOnly)}`);
    }
  };

  useEffect(() => {
    const prefix = getIdentifierPrefix();
    const currentNumber = watch("identificador_temp");

    const prefixPadre = getIdentifierPrefixPadre();
    const currentNumberPadre = watch("identificador_temp_padre");

    const prefixMadre = getIdentifierPrefixMadre();
    const currentNumberMadre = watch("identificador_temp_madre");

    if (prefix && currentNumber?.length === 6) {
      setValue("identificador", `${prefix}-${formatNumber(currentNumber)}`);
    } else if (!currentNumber && watch("identificador")) {
      setValue("identificador", watch("identificador"));
    }

    if (prefixPadre && currentNumberPadre?.length === 6) {
      setValue(
        "arete_padre",
        `${prefixPadre}-${formatNumber(currentNumberPadre)}`
      );
    } else if (!currentNumberPadre && watch("arete_padre")) {
      setValue("arete_padre", watch("arete_padre"));
    }

    if (prefixMadre && currentNumberMadre?.length === 6) {
      setValue(
        "arete_madre",
        `${prefixMadre}-${formatNumber(currentNumberMadre)}`
      );
    } else if (!currentNumberMadre && watch("arete_madre")) {
      setValue("arete_madre", watch("arete_madre"));
    }
  }, [
    watch("especie"),
    watch("razaIds"),
    watch("razas_padre"),
    watch("razas_madre"),
    watch("sexo"),
    watch("identificador_temp"),
    watch("identificador"),
    watch("identificador_temp_padre"),
    watch("arete_padre"),
    watch("identificador_temp_madre"),
    watch("arete_madre"),
  ]);

  const mutation = useMutation({
    mutationFn: (data: Partial<CrearAnimalByFinca>) =>
      ActualizarAnimal(animalId, data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Animal actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["animal-id", animalId] });
      navigation.goBack();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al actualizar el animal";

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

  const onSubmit = (data: Partial<CrearAnimalByFinca>) => {
    if (!userId) return;

    if (!data.especie) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar una especie",
      });
      return;
    }

    if (!data.razaIds) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar una raza",
      });
      return;
    }

    if (!data.sexo) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Debes seleccionar un sexo",
      });
      return;
    }

    if (
      data.identificador &&
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,7}[12]-\d{6}$/.test(data.identificador)
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El identificador debe tener el formato correcto",
      });
      return;
    }

    const animalData = {
      ...data,
      propietarioId: userId,
    };

    delete (animalData as any).identificador_temp;
    delete (animalData as any).identificador_temp_padre;
    delete (animalData as any).identificador_temp_madre;

    mutation.mutate(animalData);
  };

  if (!animalData?.data) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { minHeight: height * 0.8 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { width: width * 0.9 }]}>
            <ThemedPicker
              items={especiesItems}
              onValueChange={(value) => {
                setValue("especie", value);
                setValue("razaIds", []);
                setEspecieId(value);
              }}
              selectedValue={watch("especie") || ""}
              placeholder="Selecciona una especie"
              icon="paw-outline"
              error={errors.especie?.message}
            />

            <ThemedPicker
              items={sexoItems}
              onValueChange={(value) => setValue("sexo", value)}
              selectedValue={watch("sexo") || ""}
              placeholder="Selecciona un sexo"
              icon="transgender-outline"
              error={errors.sexo?.message}
            />

            <ThemedTextInput
              placeholder="Color del animal"
              icon="color-palette-outline"
              value={watch("color")}
              onChangeText={(text) => setValue("color", text)}
              error={errors.color?.message}
              style={styles.input}
            />

            <ThemedTextInput
              placeholder="Ingrese 6 dígitos"
              icon="warning-outline"
              onFocus={() => setShowIdentifierHelp(true)}
              onBlur={() => setShowIdentifierHelp(false)}
              value={watch("identificador_temp") || ""}
              onChangeText={handleIdentifierChange}
              error={
                watch("especie") && watch("razaIds") && watch("sexo")
                  ? errors.identificador?.message
                  : undefined
              }
              style={styles.input}
              keyboardType="numeric"
              maxLength={6}
            />

            {showIdentifierHelp && (
              <Text style={styles.helpText}>
                NÚMERO DE SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
              </Text>
            )}

            <ThemedMultiPicker
              items={
                razas?.data.map((raza) => ({
                  label: raza.nombre,
                  value: raza.id,
                })) || []
              }
              onValuesChange={(values) => setValue("razaIds", values)}
              selectedValues={(watch("razaIds") as string[]) || []}
              placeholder="Selecciona una o más razas"
              icon="git-branch-outline"
              error={errors.razaIds?.message}
            />

            <ThemedPicker
              items={purezaOptions}
              onValueChange={(value) => setValue("pureza", value)}
              selectedValue={watch("pureza") || ""}
              placeholder="Selecciona pureza"
              icon="layers-outline"
              error={errors.pureza?.message}
            />

            <ThemedTextInput
              placeholder="Fecha de nacimiento"
              icon="calendar-outline"
              value={watch("fecha_nacimiento")}
              onFocus={() => setShowDatePicker(true)}
              showSoftInputOnFocus={false}
              error={errors.fecha_nacimiento?.message}
              style={styles.input}
            />

            {showDatePicker && (
              <DateTimePicker
                value={
                  watch("fecha_nacimiento")
                    ? new Date(
                        watch("fecha_nacimiento") || new Date().toISOString()
                      )
                    : new Date()
                }
                mode="date"
                display="spinner"
                onChange={handleDateChange}
              />
            )}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tipo de alimentación</Text>
              {alimentosOptions.map((alimento) => {
                const alimentoSeleccionado = tipoAlimentacion.find(
                  (a) => a.alimento === alimento.value
                );

                return (
                  <View key={alimento.value} style={styles.categoryContainer}>
                    <TouchableOpacity
                      style={styles.categoryHeader}
                      onPress={() => toggleAlimentoExpand(alimento.value)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Checkbox
                          status={
                            isAlimentoSeleccionado(alimento.value)
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() => {
                            if (isAlimentoSeleccionado(alimento.value)) {
                              const updated = tipoAlimentacion.filter(
                                (a) => a.alimento !== alimento.value
                              );
                              setTipoAlimentacion(updated);
                              setValue("tipo_alimentacion", updated);
                            } else {
                              const updated = [
                                ...tipoAlimentacion,
                                {
                                  alimento: alimento.value,
                                  origen: "comprado",
                                },
                              ];
                              setTipoAlimentacion(updated);
                              setValue("tipo_alimentacion", updated);
                            }
                          }}
                          color={colors.primary}
                        />
                        <ThemedText style={styles.categoryTitle}>
                          {alimento.label}
                        </ThemedText>
                      </View>

                      <FontAwesome
                        name={
                          expandedAlimento === alimento.value
                            ? "chevron-up"
                            : "chevron-down"
                        }
                        size={16}
                        color={colors.primary}
                      />
                    </TouchableOpacity>

                    {expandedAlimento === alimento.value &&
                      isAlimentoSeleccionado(alimento.value) && (
                        <View style={styles.subservicesContainer}>
                          {[
                            "comprado",
                            "producido",
                            "comprado y producido",
                          ].map((origen) => (
                            <TouchableOpacity
                              key={origen}
                              style={styles.subserviceItem}
                              onPress={() =>
                                handleOrigenSelection(
                                  alimento.value,
                                  origen as
                                    | "comprado"
                                    | "producido"
                                    | "comprado y producido"
                                )
                              }
                            >
                              <Checkbox
                                status={
                                  tipoAlimentacion.find(
                                    (a) => a.alimento === alimento.value
                                  )?.origen === origen
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() =>
                                  handleOrigenSelection(
                                    alimento.value,
                                    origen as
                                      | "comprado"
                                      | "producido"
                                      | "comprado y producido"
                                  )
                                }
                                color={colors.primary}
                              />
                              <ThemedText style={styles.subserviceText}>
                                {(() => {
                                  switch (origen) {
                                    case "comprado":
                                      return "Comprado";
                                    case "producido":
                                      return "Producido";
                                    case "comprado y producido":
                                      return "Comprado y producido";
                                    default:
                                      return origen;
                                  }
                                })()}
                              </ThemedText>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                  </View>
                );
              })}

              {errors.tipo_alimentacion?.message && (
                <Text style={styles.errorText}>
                  {errors.tipo_alimentacion.message}
                </Text>
              )}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tipo de complemento</Text>
              {complementosOptions.map((complemento) => (
                <ThemedCheckbox
                  key={complemento.value}
                  label={complemento.label}
                  value={complemento.value}
                  onPress={handleAlimentoChange}
                  isSelected={complementoSeleccionados.includes(
                    complemento.value
                  )}
                />
              ))}
            </View>

            <ThemedTextInput
              placeholder="Medicamentos"
              icon="medical-outline"
              value={watch("medicamento")}
              onChangeText={(text) => setValue("medicamento", text)}
              error={errors.medicamento?.message}
              style={styles.input}
            />

            {selectedSexo === "Macho" && (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Castrado</Text>
                <Switch
                  value={watch("castrado") || false}
                  onValueChange={(value) => setValue("castrado", value)}
                  color={colors.primary}
                />
              </View>
            )}

            {selectedSexo === "Hembra" && (
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Esterilizado</Text>
                <Switch
                  value={watch("esterelizado") || false}
                  onValueChange={(value) => setValue("esterelizado", value)}
                  color={colors.primary}
                />
              </View>
            )}

            <ThemedTextInput
              placeholder="Observaciones"
              icon="clipboard-outline"
              value={watch("observaciones")}
              onChangeText={(text) => setValue("observaciones", text)}
              error={errors.observaciones?.message}
              style={[styles.input, styles.multilineInput]}
            />

            <ThemedPicker
              items={fincasItems}
              onValueChange={(value) => setValue("fincaId", value)}
              selectedValue={watch("fincaId") || ""}
              placeholder="Selecciona una finca"
              icon="podium-outline"
              error={errors.fincaId?.message}
            />

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Información del Padre</Text>

              <ThemedTextInput
                placeholder="Nombre del padre"
                icon="male-outline"
                value={watch("nombre_padre")}
                onChangeText={(text) => setValue("nombre_padre", text)}
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Número de arete del padre"
                icon="pricetag-outline"
                onFocus={() => setShowIdentifierHelp1(true)}
                onBlur={() => setShowIdentifierHelp1(false)}
                value={watch("identificador_temp_padre") || ""}
                onChangeText={handleIdentifierChangePadre}
                error={
                  watch("especie") && watch("razas_padre") && watch("sexo")
                    ? errors.arete_padre?.message
                    : undefined
                }
                style={styles.input}
                keyboardType="numeric"
              />
              {showIdentifierHelp1 && (
                <Text style={styles.helpText}>
                  NÚMERO DE SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
                </Text>
              )}

              <ThemedMultiPicker
                items={
                  razas?.data.map((raza) => ({
                    label: raza.nombre,
                    value: raza.id,
                  })) || []
                }
                onValuesChange={(values) => setValue("razas_padre", values)}
                selectedValues={(watch("razas_padre") as string[]) || []}
                placeholder="Selecciona una o más razas"
                icon="git-branch-outline"
                error={errors.razas_padre?.message}
              />

              <ThemedPicker
                items={purezaOptions}
                onValueChange={(value) => setValue("pureza_padre", value)}
                selectedValue={watch("pureza_padre") || ""}
                placeholder="Selecciona pureza"
                icon="layers-outline"
                error={errors.pureza_padre?.message}
              />

              <ThemedTextInput
                placeholder="Nombre del criador del padre"
                icon="person-outline"
                value={watch("nombre_criador_padre")}
                onChangeText={(text) => setValue("nombre_criador_padre", text)}
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Nombre del propietario del padre"
                icon="person-outline"
                value={watch("nombre_propietario_padre")}
                onChangeText={(text) =>
                  setValue("nombre_propietario_padre", text)
                }
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Finca de origen del padre"
                icon="home-outline"
                value={watch("nombre_finca_origen_padre")}
                onChangeText={(text) =>
                  setValue("nombre_finca_origen_padre", text)
                }
                style={styles.input}
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>¿Padre fue comprado?</Text>
                <Switch
                  value={watch("compra_padre") || false}
                  onValueChange={(value) => setValue("compra_padre", value)}
                  color={colors.primary}
                />
              </View>

              {watch("compra_padre") && (
                <ThemedTextInput
                  placeholder="Nombre del criador de origen (compra)"
                  icon="person-outline"
                  value={watch("nombre_criador_origen_padre")}
                  onChangeText={(text) =>
                    setValue("nombre_criador_origen_padre", text)
                  }
                  style={styles.input}
                />
              )}
            </View>

            {/* Sección de información de la madre */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Información de la Madre</Text>

              <ThemedTextInput
                placeholder="Nombre de la madre"
                icon="female-outline"
                value={watch("nombre_madre")}
                onChangeText={(text) => setValue("nombre_madre", text)}
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Número de arete de la madre"
                icon="pricetag-outline"
                onFocus={() => setShowIdentifierHelp2(true)}
                onBlur={() => setShowIdentifierHelp2(false)}
                value={watch("identificador_temp_madre") || ""}
                onChangeText={handleIdentifierChangeMadre}
                error={
                  watch("especie") && watch("razas_madre") && watch("sexo")
                    ? errors.arete_madre?.message
                    : undefined
                }
                style={styles.input}
                keyboardType="numeric"
              />
              {showIdentifierHelp2 && (
                <Text style={styles.helpText}>
                  NÚMERO DE SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
                </Text>
              )}

              <ThemedMultiPicker
                items={
                  razas?.data.map((raza) => ({
                    label: raza.nombre,
                    value: raza.id,
                  })) || []
                }
                onValuesChange={(values) => setValue("razas_madre", values)}
                selectedValues={(watch("razas_madre") as string[]) || []}
                placeholder="Selecciona una o más razas"
                icon="git-branch-outline"
                error={errors.razas_madre?.message}
              />

              <ThemedPicker
                items={purezaOptions}
                onValueChange={(value) => setValue("pureza_madre", value)}
                selectedValue={watch("pureza_madre") || ""}
                placeholder="Selecciona pureza"
                icon="layers-outline"
                error={errors.pureza_madre?.message}
              />

              <ThemedTextInput
                placeholder="Nombre del criador de la madre"
                icon="person-outline"
                value={watch("nombre_criador_madre")}
                onChangeText={(text) => setValue("nombre_criador_madre", text)}
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Nombre del propietario de la madre"
                icon="person-outline"
                value={watch("nombre_propietario_madre")}
                onChangeText={(text) =>
                  setValue("nombre_propietario_madre", text)
                }
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Finca de origen de la madre"
                icon="home-outline"
                value={watch("nombre_finca_origen_madre")}
                onChangeText={(text) =>
                  setValue("nombre_finca_origen_madre", text)
                }
                style={styles.input}
              />

              <ThemedTextInput
                placeholder="Número de parto de la madre"
                icon="list-outline"
                value={watch("numero_parto_madre")?.toString() || "0"}
                onChangeText={(text) =>
                  setValue("numero_parto_madre", Number(text) || 0)
                }
                style={styles.input}
                keyboardType="numeric"
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>¿Madre fue comprada?</Text>
                <Switch
                  value={watch("compra_madre") || false}
                  onValueChange={(value) => setValue("compra_madre", value)}
                  color={colors.primary}
                />
              </View>

              {watch("compra_madre") && (
                <ThemedTextInput
                  placeholder="Nombre del criador de origen (compra)"
                  icon="person-outline"
                  value={watch("nombre_criador_origen_madre")}
                  onChangeText={(text) =>
                    setValue("nombre_criador_origen_madre", text)
                  }
                  style={styles.input}
                />
              )}
            </View>

            <ThemedButton
              title="Actualizar Animal"
              onPress={handleSubmit(onSubmit)}
              icon="save-outline"
              loading={mutation.isPending}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  formContainer: {
    maxWidth: 500,
    alignSelf: "center",
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  datePicker: {
    width: "100%",
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 15,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  identifierPreview: {
    marginBottom: 15,
    color: "#666",
    fontSize: 14,
  },
  helpText: {
    color: "#e63946",
    fontSize: 12,
    marginBottom: 10,
    fontStyle: "italic",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subservicesContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  subserviceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subserviceText: {
    marginLeft: 8,
  },
});

export default AnimalDetailsPage;
