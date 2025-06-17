import { obtenerDeptosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { obtenerMunicipiosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import { CreateUser } from "@/core/users/accions/crear-usuario";
import { CrearUsuario } from "@/core/users/interfaces/create-user.interface";
import usePaisesActives from "@/hooks/paises/usePaises";
import usePaisesById from "@/hooks/paises/usePaisesById";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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

  const { data } = usePaisesActives();

  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (pais?.data) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
      trigger("identificacion");
    }
  }, [pais, trigger]);

  const { data: departamentos } = useQuery({
    queryKey: ["departamentos", paisId],
    queryFn: () => obtenerDeptosPaisById(paisId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!paisId,
  });

  const { data: municipios } = useQuery({
    queryKey: ["municipios", departamentoId],
    queryFn: () => obtenerMunicipiosDeptoById(departamentoId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!departamentoId,
  });

  const countryItems =
    data?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id.toString(),
    })) || [];

  const departmentItems =
    departamentos?.data.departamentos.map((depto) => ({
      label: depto.nombre,
      value: depto.id.toString(),
    })) || [];

  const municipalityItems =
    municipios?.data.municipios.map((mun) => ({
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { marginTop: height * 0.1 }]}>
          <ThemedText type="title" style={styles.title}>
            Regístrate
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Completa tus datos para crear una cuenta
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                  phoneRegex.test(value) || "Formato inválido. Use: xxxx-xxxx"
                );
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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

        <View style={styles.buttonContainer}>
          <ThemedButton
            title="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            icon="person-add-outline"
            loading={mutation.isPending}
          />
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>¿Ya tienes cuenta?</ThemedText>
          <ThemedLink
            href="/(auth)/login"
            style={styles.loginLink}
            iconPosition="right"
          >
            Iniciar sesión
          </ThemedLink>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿Olvidaste tu contraseña?</ThemedText>
          <ThemedLink href="/(auth)/change-password" style={{ marginLeft: 5 }}>
            Cambiar
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    marginRight: 5,
  },
  loginLink: {
    fontWeight: "600",
  },
  selectContainer: {
    marginBottom: 15,
  },
  selectLabel: {
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  selectWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  select: {
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default RegisterScreen;
