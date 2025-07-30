import { CreateAnimal } from "@/core/animales/accions/crear-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { complementosOptions } from "@/helpers/data/complementos";
import { dataProduccion } from "@/helpers/data/dataProduccion";
import { dataTipoProduccion } from "@/helpers/data/dataTipoProduccion";
import { purezaOptions } from "@/helpers/data/purezaOptions";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import { tipoReproduccionOptions } from "@/helpers/data/tipoReproduccionOptions";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ButtonNext from "@/presentation/components/animales/ButtonNext";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedMultiPicker from "@/presentation/theme/components/ThemedMultiPicker";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Checkbox,
  SegmentedButtons,
  Switch,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearAnimal = () => {
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const primary = useThemeColor({}, "primary");
  const { height, width } = useWindowDimensions();
  const [valor, setValor] = useState<"animal" | "padre" | "madre">("animal");
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelp1, setShowIdentifierHelp1] = useState(false);
  const [showIdentifierHelp2, setShowIdentifierHelp2] = useState(false);
  const [expandedAlimento, setExpandedAlimento] = useState<string | null>(null);
  const [tipoAlimentacion, setTipoAlimentacion] = useState<
    {
      alimento: string;
      origen: string;
      porcentaje_comprado?: number;
      porcentaje_producido?: number;
    }[]
  >([]);
  const [complementoSeleccionados, setComplementoSeleccionados] = useState<
    string[]
  >([]);
  const [checkAnimal, setcheckAnimal] = useState(false);

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
    formState: { errors },
    reset,
  } = useForm<
    CrearAnimalByFinca & {
      identificador_temp: string;
      identificador_temp_padre: string;
      identificador_temp_madre: string;
    }
  >();

  const { data: especies } = useGetEspecies();
  const especieId = watch("especie");
  const { data: razas } = useGetRazasByEspecie(especieId);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      const localDate = new Date(selectedDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setValue("fecha_nacimiento", formatted);
    }
  };

  const { data: fincas } = useFincasPropietarios(user?.id ?? "");

  const especiesItmes =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  const sexoItems = sexoOptions.map((sexo) => ({
    label: sexo.label,
    value: sexo.value,
  }));

  const produccionItems = dataProduccion.map((produccion) => ({
    label: produccion.label,
    value: produccion.value,
  }));

  const tipoProduccionItems = dataTipoProduccion.map((produccion) => ({
    label: produccion.label,
    value: produccion.value,
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

  const getIdentifierPrefix = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaIds: string[] = watch("razaIds");
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
      setValue("identificador", `${prefix}-${formatNumber(numbersOnly)}`);
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

  useEffect(() => {
    const prefix = getIdentifierPrefix();
    const currentNumber = watch("identificador_temp");

    const prefixPadre = getIdentifierPrefixPadre();
    const currentNumberPadre = watch("identificador_temp_padre");

    const prefixMadre = getIdentifierPrefixMadre();
    const currentNumberMadre = watch("identificador_temp_madre");

    if (prefix && currentNumber?.length === 6) {
      setValue("identificador", `${prefix}-${formatNumber(currentNumber)}`);
    }

    if (prefixPadre && currentNumberPadre?.length === 6) {
      setValue(
        "arete_padre",
        `${prefixPadre}-${formatNumber(currentNumberPadre)}`
      );
    }

    if (prefixMadre && currentNumberMadre?.length === 6) {
      const areteMadre = `${prefixMadre}-${formatNumber(currentNumberMadre)}`;

      setValue("arete_madre", areteMadre);
    }
  }, [
    watch("especie"),
    watch("razaIds"),
    watch("razas_madre"),
    watch("razas_padre"),
    watch("sexo"),
    watch("identificador_temp"),
    watch("identificador_temp_padre"),
    watch("identificador_temp_madre"),
  ]);

  const mutation = useMutation({
    mutationFn: (data: CrearAnimalByFinca) => CreateAnimal(data),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Animal creado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();

      navigation.goBack();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al crear el animal";

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

  const onSubmit = (data: CrearAnimalByFinca) => {
    if (!user?.id) return;

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
      !data.identificador ||
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,7}[12]-\d{6}$/.test(data.identificador)
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "El identificador debe tener 6 dígitos",
      });
      return;
    }

    const animalData = {
      ...data,
      propietarioId: user.id,
    };

    delete (animalData as any).identificador_temp;
    delete (animalData as any).identificador_temp_padre;
    delete (animalData as any).identificador_temp_madre;

    mutation.mutate(animalData);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer]}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedView style={{ marginBottom: 12 }}>
            <SegmentedButtons
              value={valor}
              onValueChange={(value) =>
                setValor(value as "animal" | "padre" | "madre")
              }
              buttons={[
                {
                  value: "animal",
                  label: "Animal",
                  icon: "paw",
                  style: valor === "animal" ? { backgroundColor: primary } : {},
                  labelStyle: valor === "animal" ? { color: "#fff" } : {},
                },
                {
                  value: "padre",
                  label: "Padre",
                  icon: "gender-male",
                  style: valor === "padre" ? { backgroundColor: primary } : {},
                  labelStyle: valor === "padre" ? { color: "#fff" } : {},
                },
                {
                  value: "madre",
                  label: "Madre",
                  icon: "gender-female",
                  style: valor === "madre" ? { backgroundColor: primary } : {},
                  labelStyle: valor === "madre" ? { color: "#fff" } : {},
                },
              ]}
            />
          </ThemedView>
          <View style={[styles.formContainer, { width: width * 0.9 }]}>
            {valor === "animal" && (
              <ThemedView
                style={{ marginBottom: 20, backgroundColor: colors.background }}
              >
                <Text style={styles.sectionTitle}>Datos del animal</Text>
                <ThemedPicker
                  items={especiesItmes}
                  onValueChange={(value) => setValue("especie", value)}
                  selectedValue={watch("especie")}
                  placeholder="Selecciona una especie"
                  icon="paw-outline"
                  error={errors.especie?.message}
                />

                <ThemedPicker
                  items={sexoItems}
                  onValueChange={(value) => setValue("sexo", value)}
                  selectedValue={watch("sexo")}
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
                  placeholder="Arete (ingrese 6 dígitos)"
                  icon="warning-outline"
                  value={watch("identificador_temp") || ""}
                  onChangeText={handleIdentifierChange}
                  onFocus={() => setShowIdentifierHelp(true)}
                  onBlur={() => setShowIdentifierHelp(false)}
                  error={errors.identificador?.message}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={6}
                />

                {showIdentifierHelp && (
                  <Text style={styles.helpText}>
                    PRIMEROS SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
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
                  selectedValue={watch("pureza")}
                  placeholder="Nivel de pureza"
                  icon="layers-outline"
                  error={errors.pureza?.message}
                />

                <ThemedPicker
                  items={tipoReproduccionOptions}
                  onValueChange={(value) =>
                    setValue("tipo_reproduccion", value)
                  }
                  selectedValue={watch("tipo_reproduccion")}
                  placeholder="Selecciona tipo de reproducción"
                  icon="git-compare-outline"
                  error={errors.tipo_reproduccion?.message}
                />

                <ThemedPicker
                  items={produccionItems}
                  onValueChange={(value) => setValue("produccion", value)}
                  selectedValue={watch("produccion")}
                  placeholder="Selecciona la produccion"
                  icon="options-outline"
                  error={errors.produccion?.message}
                />
                <ThemedPicker
                  items={tipoProduccionItems}
                  onValueChange={(value) => setValue("tipo_produccion", value)}
                  selectedValue={watch("tipo_produccion")}
                  placeholder="Selecciona el tipo produccion"
                  icon="options-outline"
                  error={errors.tipo_produccion?.message}
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
                            Number(watch("fecha_nacimiento").split("-")[0]),
                            Number(watch("fecha_nacimiento").split("-")[1]) - 1,
                            Number(watch("fecha_nacimiento").split("-")[2])
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
                      <View
                        key={alimento.value}
                        style={styles.categoryContainer}
                      >
                        <TouchableOpacity
                          style={styles.categoryHeader}
                          onPress={() => toggleAlimentoExpand(alimento.value)}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
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
                                <View key={origen}>
                                  <TouchableOpacity
                                    style={[
                                      styles.subserviceItem,
                                      alimentoSeleccionado?.origen === origen &&
                                        styles.selectedSubserviceItem,
                                    ]}
                                    onPress={() =>
                                      handleOrigenSelection(
                                        alimento.value,
                                        origen
                                      )
                                    }
                                  >
                                    <Checkbox
                                      status={
                                        alimentoSeleccionado?.origen === origen
                                          ? "checked"
                                          : "unchecked"
                                      }
                                      onPress={() =>
                                        handleOrigenSelection(
                                          alimento.value,
                                          origen
                                        )
                                      }
                                      color={colors.primary}
                                    />
                                    <ThemedText style={styles.subserviceText}>
                                      {origen === "comprado"
                                        ? "Comprado"
                                        : origen === "producido"
                                        ? "Producido"
                                        : "Comprado y producido"}
                                    </ThemedText>
                                  </TouchableOpacity>

                                  {alimentoSeleccionado?.origen ===
                                    "comprado y producido" &&
                                    origen === "comprado y producido" && (
                                      <View
                                        style={styles.percentageInputsContainer}
                                      >
                                        <View
                                          style={styles.percentageInputWrapper}
                                        >
                                          <ThemedText
                                            style={styles.percentageLabel}
                                          >
                                            % Comprado:
                                          </ThemedText>
                                          <ThemedTextInput
                                            placeholder="Ej: 60"
                                            value={
                                              alimentoSeleccionado.porcentaje_comprado?.toString() ||
                                              ""
                                            }
                                            onChangeText={(text) => {
                                              if (
                                                text === "" ||
                                                /^\d+$/.test(text)
                                              ) {
                                                const updated =
                                                  tipoAlimentacion.map((item) =>
                                                    item.alimento ===
                                                    alimento.value
                                                      ? {
                                                          ...item,
                                                          porcentaje_comprado:
                                                            text
                                                              ? Number(text)
                                                              : undefined,
                                                        }
                                                      : item
                                                  );
                                                setTipoAlimentacion(updated);
                                                setValue(
                                                  "tipo_alimentacion",
                                                  updated
                                                );
                                              }
                                            }}
                                            keyboardType="number-pad"
                                            style={styles.percentageInput}
                                            maxLength={3}
                                          />
                                        </View>

                                        <View
                                          style={styles.percentageInputWrapper}
                                        >
                                          <ThemedText
                                            style={styles.percentageLabel}
                                          >
                                            % Producido:
                                          </ThemedText>
                                          <ThemedTextInput
                                            placeholder="Ej: 40"
                                            value={
                                              alimentoSeleccionado.porcentaje_producido?.toString() ||
                                              ""
                                            }
                                            onChangeText={(text) => {
                                              if (
                                                text === "" ||
                                                /^\d+$/.test(text)
                                              ) {
                                                const updated =
                                                  tipoAlimentacion.map((item) =>
                                                    item.alimento ===
                                                    alimento.value
                                                      ? {
                                                          ...item,
                                                          porcentaje_producido:
                                                            text
                                                              ? Number(text)
                                                              : undefined,
                                                        }
                                                      : item
                                                  );
                                                setTipoAlimentacion(updated);
                                                setValue(
                                                  "tipo_alimentacion",
                                                  updated
                                                );
                                              }
                                            }}
                                            keyboardType="number-pad"
                                            style={styles.percentageInput}
                                            maxLength={3}
                                          />
                                        </View>

                                        {alimentoSeleccionado.porcentaje_comprado !==
                                          undefined &&
                                          alimentoSeleccionado.porcentaje_producido !==
                                            undefined &&
                                          alimentoSeleccionado.porcentaje_comprado +
                                            alimentoSeleccionado.porcentaje_producido !==
                                            100 && (
                                            <Text style={styles.errorText}>
                                              La suma de porcentajes debe ser
                                              100%
                                            </Text>
                                          )}
                                      </View>
                                    )}
                                </View>
                              ))}
                            </View>
                          )}
                      </View>
                    );
                  })}
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
                  placeholder="Medicamentos (opcional)"
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
                  placeholder="Caracteristicas"
                  icon="clipboard-outline"
                  value={watch("observaciones")}
                  onChangeText={(text) => setValue("observaciones", text)}
                  error={errors.observaciones?.message}
                  style={[styles.input, styles.multilineInput]}
                />

                <ThemedPicker
                  items={fincasItems}
                  onValueChange={(value) => setValue("fincaId", value)}
                  selectedValue={watch("fincaId")}
                  placeholder="Selecciona una finca"
                  icon="podium-outline"
                  error={errors.fincaId?.message}
                />

                <View style={styles.switchContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setcheckAnimal((prev) => {
                        setValue("compra_animal", !prev);
                        return !prev;
                      });
                    }}
                    style={styles.radioItem}
                  >
                    <Checkbox status={checkAnimal ? "checked" : "unchecked"} />
                    <Text>¿Animal fue comprado?</Text>
                  </TouchableOpacity>
                </View>

                {checkAnimal && (
                  <ThemedTextInput
                    placeholder="Nombre del criador (origen)"
                    icon="person-outline"
                    value={watch("nombre_criador_origen_animal")}
                    onChangeText={(text) =>
                      setValue("nombre_criador_origen_animal", text)
                    }
                    error={errors.nombre_criador_origen_animal?.message}
                    style={styles.input}
                  />
                )}
                <ButtonNext onPress={() => setValor("padre")} />
              </ThemedView>
            )}
            {/* DATOS PADRE */}

            {valor === "padre" && (
              <View
                style={[
                  styles.sectionContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={styles.sectionTitle}>Datos del padre</Text>
                <ThemedTextInput
                  placeholder="Nombre Padre (opcional)"
                  icon="aperture-outline"
                  value={watch("nombre_padre")}
                  onChangeText={(text) => setValue("nombre_padre", text)}
                  error={errors.nombre_padre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Arete Padre (ingrese 6 dígitos)"
                  icon="warning-outline"
                  value={watch("identificador_temp_padre") || ""}
                  onChangeText={handleIdentifierChangePadre}
                  onFocus={() => setShowIdentifierHelp1(true)}
                  onBlur={() => setShowIdentifierHelp1(false)}
                  error={errors.arete_padre?.message}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {showIdentifierHelp1 && (
                  <Text style={styles.helpText}>
                    PRIMEROS SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
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
                  selectedValue={watch("pureza_padre")}
                  placeholder="Nivel de pureza"
                  icon="layers-outline"
                  error={errors.pureza_padre?.message}
                />
                <ThemedTextInput
                  placeholder="Nombre Criador"
                  icon="person-outline"
                  value={watch("nombre_criador_padre")}
                  onChangeText={(text) =>
                    setValue("nombre_criador_padre", text)
                  }
                  error={errors.nombre_criador_padre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Nombre Propietario"
                  icon="person-outline"
                  value={watch("nombre_propietario_padre")}
                  onChangeText={(text) =>
                    setValue("nombre_propietario_padre", text)
                  }
                  error={errors.nombre_propietario_padre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Nombre de la finca"
                  icon="home-outline"
                  value={watch("nombre_finca_origen_padre")}
                  onChangeText={(text) =>
                    setValue("nombre_finca_origen_padre", text)
                  }
                  error={errors.nombre_finca_origen_padre?.message}
                  style={styles.input}
                />
                <ButtonNext onPress={() => setValor("madre")} />
              </View>
            )}

            {valor === "madre" && (
              <View
                style={[
                  styles.sectionContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text style={styles.sectionTitle}>Datos de la madre</Text>
                <ThemedTextInput
                  placeholder="Nombre Madre (opcional)"
                  icon="aperture-outline"
                  value={watch("nombre_madre")}
                  onChangeText={(text) => setValue("nombre_madre", text)}
                  error={errors.nombre_madre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Arete Madre (ingrese 6 dígitos)"
                  icon="warning-outline"
                  value={watch("identificador_temp_madre") || ""}
                  onChangeText={handleIdentifierChangeMadre}
                  onFocus={() => setShowIdentifierHelp2(true)}
                  onBlur={() => setShowIdentifierHelp2(false)}
                  error={errors.arete_madre?.message}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={6}
                />
                {showIdentifierHelp2 && (
                  <Text style={styles.helpText}>
                    PRIMEROS SEIS DIGITOS DE IDENTIFICACIÓN DEL ARETE
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
                  selectedValue={watch("pureza_madre")}
                  placeholder="Nivel de pureza"
                  icon="layers-outline"
                  error={errors.pureza_madre?.message}
                />
                <ThemedTextInput
                  placeholder="Nombre Criador"
                  icon="person-outline"
                  value={watch("nombre_criador_madre")}
                  onChangeText={(text) =>
                    setValue("nombre_criador_madre", text)
                  }
                  error={errors.nombre_criador_madre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Nombre Propietario"
                  icon="person-outline"
                  value={watch("nombre_propietario_madre")}
                  onChangeText={(text) =>
                    setValue("nombre_propietario_madre", text)
                  }
                  error={errors.nombre_propietario_madre?.message}
                  style={[styles.input, styles.multilineInput]}
                />
                <ThemedTextInput
                  placeholder="Numero de parto"
                  icon="warning-outline"
                  value={watch("numero_parto_madre")?.toString() || ""}
                  onChangeText={(text) =>
                    setValue("numero_parto_madre", Number(text))
                  }
                  error={errors.numero_parto_madre?.message}
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <ThemedTextInput
                  placeholder="Nombre de la finca"
                  icon="home-outline"
                  value={watch("nombre_finca_origen_madre")}
                  onChangeText={(text) =>
                    setValue("nombre_finca_origen_madre", text)
                  }
                  style={styles.input}
                />
                <ThemedButton
                  title="Crear Animal"
                  onPress={handleSubmit(onSubmit)}
                  icon="arrow-forward-outline"
                  loading={mutation.isPending}
                  style={styles.submitButton}
                />
              </View>
            )}
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
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subservicesContainer: {
    marginTop: 10,
    paddingLeft: 10,
  },
  subserviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  subserviceText: {
    marginLeft: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  selectedSubserviceItem: {
    backgroundColor: "#f0f0f0",
  },
  percentageInputsContainer: {
    marginLeft: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  percentageInputWrapper: {
    marginBottom: 12,
  },
  percentageLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  percentageInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});

export default CrearAnimal;
