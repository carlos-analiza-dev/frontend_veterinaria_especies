import { CreateAnimal } from "@/core/animales/accions/crear-animal";
import { CrearAnimalByFinca } from "@/core/animales/interfaces/crear-animal.interface";
import { alimentosOptions } from "@/helpers/data/alimentos";
import { complementosOptions } from "@/helpers/data/complementos";
import { sexoOptions } from "@/helpers/data/sexo_animales";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
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
import { Checkbox, Switch, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearAnimal = () => {
  const { user } = useAuthStore();
  const { colors } = useTheme();
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [showIdentifierHelp1, setShowIdentifierHelp1] = useState(false);
  const [showIdentifierHelp2, setShowIdentifierHelp2] = useState(false);
  const [expandedAlimento, setExpandedAlimento] = useState<string | null>(null);
  const [tipoAlimentacion, setTipoAlimentacion] = useState<
    { alimento: string; origen: string }[]
  >([]);
  const [complementoSeleccionados, setComplementoSeleccionados] = useState<
    string[]
  >([]);
  const [checkedPadre, setCheckedPadre] = useState(false);
  const [checkedMadre, setCheckedMadre] = useState(false);

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
    const raza = razas?.data.find((r) => r.id === watch("raza"));
    const sexo = watch("sexo");

    if (!especie || !raza || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();
    const razaCode = raza.abreviatura.toUpperCase();
    const sexoCode = sexo === "Macho" ? "1" : "2";

    return `${especieCode}${razaCode}${sexoCode}`;
  };

  const getIdentifierPrefixPadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaNombre = watch("raza_padre");
    const raza = razas?.data.find((r) => r.nombre === razaNombre);
    const sexo = "1";

    if (!especie || !raza || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();
    const razaCode = raza.abreviatura.toUpperCase();

    return `${especieCode}${razaCode}${sexo}`;
  };

  const getIdentifierPrefixMadre = () => {
    const especie = especies?.data.find((e) => e.id === watch("especie"));
    const razaNombre = watch("raza_madre");
    const raza = razas?.data.find((r) => r.nombre === razaNombre);
    const sexo = "2";

    if (!especie || !raza || !sexo) return null;

    const especieCode = especie.nombre.slice(0, 2).toUpperCase();
    const razaCode = raza.abreviatura.toUpperCase();

    return `${especieCode}${razaCode}${sexo}`;
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
      setValue(
        "arete_madre",
        `${prefixMadre}-${formatNumber(currentNumberMadre)}`
      );
    }
  }, [
    watch("especie"),
    watch("raza"),
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

    if (!data.raza) {
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
      !/^[A-ZÁÉÍÓÚÑ]{2}[A-ZÁÉÍÓÚÑ]{3,4}[12]-\d{6}$/.test(data.identificador)
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
          <View style={[styles.formContainer, { width: width * 0.9 }]}>
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

            <ThemedPicker
              items={
                razas?.data.map((raza) => ({
                  label: raza.nombre,
                  value: raza.id,
                })) || []
              }
              onValueChange={(value) => setValue("raza", value)}
              selectedValue={watch("raza")}
              placeholder="Selecciona una raza"
              icon="git-branch-outline"
              error={errors.raza?.message}
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
                          {["comprado", "producido"].map((origen) => (
                            <TouchableOpacity
                              key={origen}
                              style={styles.subserviceItem}
                              onPress={() =>
                                handleOrigenSelection(
                                  alimento.value,
                                  origen as "comprado" | "producido"
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
                                    origen as "comprado" | "producido"
                                  )
                                }
                                color={colors.primary}
                              />
                              <ThemedText style={styles.subserviceText}>
                                {origen === "comprado"
                                  ? "Comprado"
                                  : "Producido"}
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

            {/* DATOS PADRE */}

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Datos padre</Text>
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

              <ThemedPicker
                items={
                  razas?.data.map((raza) => ({
                    label: raza.nombre,
                    value: raza.nombre,
                  })) || []
                }
                onValueChange={(value) => setValue("raza_padre", value)}
                selectedValue={watch("raza_padre") ?? ""}
                placeholder="Raza padre"
                icon="git-branch-outline"
                error={errors.raza_padre?.message}
              />
              <ThemedTextInput
                placeholder="Nombre Criador"
                icon="person-outline"
                value={watch("nombre_criador_padre")}
                onChangeText={(text) => setValue("nombre_criador_padre", text)}
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

              <View style={styles.switchContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setCheckedPadre((prev) => {
                      setValue("compra_padre", !prev);
                      return !prev;
                    });
                  }}
                  style={styles.radioItem}
                >
                  <Checkbox status={checkedPadre ? "checked" : "unchecked"} />
                  <Text>Comprado</Text>
                </TouchableOpacity>
              </View>

              {checkedPadre && (
                <ThemedTextInput
                  placeholder="Nombre del criador (origen)"
                  icon="person-outline"
                  value={watch("nombre_criador_origen_padre")}
                  onChangeText={(text) =>
                    setValue("nombre_criador_origen_padre", text)
                  }
                  error={errors.nombre_criador_origen_padre?.message}
                  style={styles.input}
                />
              )}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Datos madre</Text>
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

              <ThemedPicker
                items={
                  razas?.data.map((raza) => ({
                    label: raza.nombre,
                    value: raza.nombre,
                  })) || []
                }
                onValueChange={(value) => setValue("raza_madre", value)}
                selectedValue={watch("raza_madre") ?? ""}
                placeholder="Raza madre"
                icon="git-branch-outline"
                error={errors.raza_madre?.message}
              />
              <ThemedTextInput
                placeholder="Nombre Criador"
                icon="person-outline"
                value={watch("nombre_criador_madre")}
                onChangeText={(text) => setValue("nombre_criador_madre", text)}
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
              <View style={styles.switchContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setCheckedMadre((prev) => {
                      setValue("compra_madre", !prev);
                      return !prev;
                    });
                  }}
                  style={styles.radioItem}
                >
                  <Checkbox status={checkedMadre ? "checked" : "unchecked"} />
                  <Text>Comprado</Text>
                </TouchableOpacity>
              </View>

              {checkedMadre && (
                <ThemedTextInput
                  placeholder="Nombre del criador (origen)"
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
              title="Crear Animal"
              onPress={handleSubmit(onSubmit)}
              icon="arrow-forward-outline"
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
    marginBottom: 8,
  },
  subserviceText: {
    marginLeft: 8,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default CrearAnimal;
