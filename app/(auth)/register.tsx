import { CreateUser } from "@/core/users/accions/crear-usuario";
import { CrearUsuario } from "@/core/users/interfaces/create-user.interface";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const [codigoPais, setCodigoPais] = useState("");
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const ID_REGEX = {
    HN: {
      regex: /^\d{4}-\d{4}-\d{5}$/,
      message: "Formato inválido. Use: xxxx-xxxx-xxxxx",
      example: "Ejemplo: 0801-1999-01234",
    },
    SV: {
      regex: /^\d{8}-\d{1}$/,
      message: "Formato inválido. Use: xxxxxxxx-x",
      example: "Ejemplo: 04210000-5",
    },
    GT: {
      regex: /^\d{4}-\d{5}-\d{4}$/,
      message: "Formato inválido. Use: xxxx-xxxxx-xxxx",
      example: "Ejemplo: 1234-56789-0123",
    },
    PASSPORT: {
      regex: /^[A-Za-z0-9]{6,20}$/,
      message: "Formato inválido. Use 6-20 caracteres alfanuméricos",
      example: "Ejemplo: AB123456",
    },
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm<CrearUsuario>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: "",
      departamento: "",
      municipio: "",
    },
  });

  const paisId = watch("pais");
  const departamentoId = watch("departamento");

  const { data } = useGetPaisesActivos();

  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (pais?.data) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
      trigger("identificacion");
    }
  }, [pais, trigger]);

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);

  const { data: municipios } = useGetMunicipiosActivosByDepto(departamentoId);

  const countryItems =
    data?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id.toString(),
    })) || [];

  const departmentItems =
    departamentos?.data.map((depto) => ({
      label: depto.nombre,
      value: depto.id.toString(),
    })) || [];

  const municipalityItems =
    municipios?.data.map((mun) => ({
      label: mun.nombre,
      value: mun.id.toString(),
    })) || [];

  const validateIdentification = (value: string, codigoPais: string) => {
    if (!value) return "La identificación es requerida";

    switch (codigoPais) {
      case "HN":
        return ID_REGEX.HN.regex.test(value) || ID_REGEX.HN.message;
      case "SV":
        return ID_REGEX.SV.regex.test(value) || ID_REGEX.SV.message;
      case "GT":
        return ID_REGEX.GT.regex.test(value) || ID_REGEX.GT.message;
      default:
        return true;
    }
  };

  const mutation = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Éxito",
        text2: "Usuario creado correctamente",
      });
      router.push("/(auth)/login");
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: messages.join("\n"),
          });
        } else if (typeof messages === "string") {
          Toast.show({ type: "error", text1: "Error", text2: messages });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2:
              "Hubo un error al momento de crear el usuario. Inténtalo de nuevo.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error inesperado, contacte con el administrador",
        });
      }
    },
  });

  const handleCountryChange = (value: string) => {
    setValue("pais", value);
    setValue("departamento", "");
    setValue("municipio", "");
  };

  const handleDepartmentChange = (value: string) => {
    setValue("departamento", value);
    setValue("municipio", "");
  };

  const onSubmit = (data: CrearUsuario) => {
    const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;

    const payload: CrearUsuario = {
      ...data,
      telefono: telefonoConPrefijo,
    };

    mutation.mutate(payload);
  };

  return (
    <ImageBackground
      source={require("@/images/Ganaderia.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { marginTop: height * 0.1 }]}>
            <ThemedText type="title" style={styles.title}>
              Regístrate
            </ThemedText>
            <ThemedText style={{ textAlign: "center", marginBottom: 20 }}>
              Completa tus datos para crear una cuenta
            </ThemedText>

            <View style={styles.inputsContainer}>
              <ThemedTextInput
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                icon="mail-outline"
                value={watch("email")}
                onChangeText={(text) => setValue("email", text)}
                error={errors.email?.message}
              />

              <ThemedTextInput
                placeholder="Contraseña"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                icon="lock-closed-outline"
                rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
                onRightIconPress={toggleShowPassword}
                value={watch("password")}
                onChangeText={(text) => setValue("password", text)}
                error={errors.password?.message}
              />

              <ThemedTextInput
                placeholder="Nombre completo"
                autoCapitalize="words"
                icon="person-outline"
                value={watch("name")}
                onChangeText={(text) => setValue("name", text)}
                error={errors.name?.message}
              />

              <ThemedPicker
                icon="earth-outline"
                items={countryItems}
                selectedValue={watch("pais")}
                onValueChange={handleCountryChange}
                placeholder="Selecciona un país"
                error={errors.pais?.message}
              />

              {paisId && (
                <ThemedPicker
                  icon="map-outline"
                  items={departmentItems}
                  selectedValue={watch("departamento")}
                  onValueChange={handleDepartmentChange}
                  placeholder="Selecciona un departamento"
                  error={errors.departamento?.message}
                />
              )}

              {departamentoId && (
                <ThemedPicker
                  icon="location-outline"
                  items={municipalityItems}
                  selectedValue={watch("municipio")}
                  onValueChange={(value) => setValue("municipio", value)}
                  placeholder="Selecciona un municipio"
                  error={errors.municipio?.message}
                />
              )}

              <Controller
                control={control}
                name="identificacion"
                rules={{
                  validate: (value) => {
                    if (codigoPais) {
                      return validateIdentification(value, codigoPais);
                    }

                    return true;
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <ThemedTextInput
                    placeholder={
                      codigoPais === "HN"
                        ? "DNI (xxxx-xxxx-xxxxx)"
                        : codigoPais === "SV"
                        ? "DUI (xxxxxxxx-x)"
                        : codigoPais === "GT"
                        ? "DPI (xxxx-xxxxx-xxxx)"
                        : "Identificación"
                    }
                    icon="id-card-outline"
                    value={value}
                    onChangeText={(text) => {
                      let formattedText = text;
                      switch (codigoPais) {
                        case "HN":
                          formattedText = text
                            .replace(/[^\d]/g, "")
                            .replace(/^(\d{4})/, "$1-")
                            .replace(/^(\d{4}-\d{4})/, "$1-")
                            .substring(0, 15);
                          break;
                        case "SV":
                          formattedText = text
                            .replace(/[^\d]/g, "")
                            .replace(/^(\d{8})/, "$1-")
                            .substring(0, 10);
                          break;
                        case "GT":
                          formattedText = text
                            .replace(/[^\d]/g, "")
                            .replace(/^(\d{4})/, "$1-")
                            .replace(/^(\d{4}-\d{5})/, "$1-")
                            .substring(0, 15);
                          break;
                        default:
                          formattedText = text;
                      }

                      onChange(formattedText);
                    }}
                    error={error?.message}
                    maxLength={
                      codigoPais === "HN"
                        ? 15
                        : codigoPais === "SV"
                        ? 10
                        : codigoPais === "GT"
                        ? 15
                        : 20
                    }
                  />
                )}
              />

              <ThemedTextInput
                placeholder="Dirección"
                icon="location-outline"
                value={watch("direccion")}
                onChangeText={(text) => setValue("direccion", text)}
                error={errors.direccion?.message}
              />

              <Controller
                control={control}
                name="telefono"
                rules={{
                  required: "El teléfono es requerido",
                  validate: (value) => {
                    const phoneRegex = /^\d{4}-\d{4}$/;
                    return (
                      phoneRegex.test(value) ||
                      "Formato inválido. Use: xxxx-xxxx"
                    );
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <ThemedTextInput
                    placeholder="Teléfono (xxxx-xxxx)"
                    icon="call-outline"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={(text) => {
                      const cleanedText = text.replace(/[^\d]/g, "");

                      let formattedText = cleanedText;
                      if (cleanedText.length > 4) {
                        formattedText = `${cleanedText.slice(
                          0,
                          4
                        )}-${cleanedText.slice(4, 8)}`;
                      }

                      formattedText = formattedText.substring(0, 9);

                      onChange(formattedText);
                    }}
                    error={error?.message}
                    maxLength={9}
                  />
                )}
              />
            </View>

            <ThemedButton
              title="Crear cuenta"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              icon="person-add-outline"
              loading={mutation.isPending}
              style={styles.loginButton}
            />

            <View style={styles.linksContainer}>
              <View style={styles.linkRow}>
                <ThemedText>¿Ya tienes cuenta?</ThemedText>
                <ThemedLink href="/(auth)/login" style={styles.link}>
                  Iniciar sesión
                </ThemedLink>
              </View>
              <View style={styles.linkRow}>
                <ThemedText>¿Olvidaste tu contraseña?</ThemedText>
                <ThemedLink href="/(auth)/change-password" style={styles.link}>
                  Cambiar
                </ThemedLink>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  inputsContainer: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 15,
  },
  linksContainer: {
    marginTop: 20,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  link: {
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontFamily: "KanitBold",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default RegisterScreen;
