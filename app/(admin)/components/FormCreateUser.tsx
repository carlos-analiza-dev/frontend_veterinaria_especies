import { CreateUser } from "@/core/users/accions/crear-usuario";
import { CrearUsuario } from "@/core/users/interfaces/create-user.interface";
import { sexosData } from "@/helpers/data/sexo";
import { validateIdentification } from "@/helpers/funciones/validarIdentificacionUser";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";
import useGetRoles from "@/hooks/roles/useGetRoles";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const FormCreateUser = () => {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [codigoPais, setCodigoPais] = useState("");
  const [prefijoNumber, setPrefijoNumber] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    resetField,
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
      role: "",
    },
    mode: "onChange",
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

  const { data: departamentos, isLoading: loadingDeptos } =
    useGetDeptosActivesByPais(paisId);

  const { data: municipios, isLoading: loadingMunicipios } =
    useGetMunicipiosActivosByDepto(departamentoId);

  const { data: roles } = useGetRoles();

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

  const rolesItems =
    roles?.data.map((rol) => ({
      label: rol.name,
      value: rol.id.toString(),
    })) || [];

  const sexos =
    sexosData.map((sexo) => ({
      value: sexo.value,
      label: sexo.sexo,
    })) || [];

  const mutation = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      Toast.show({ type: "success", text1: "Usuario creado exitosamente." });
      navigation.goBack();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          Toast.show({
            type: "error",
            text1: messages.join("\n"),
          });
        } else if (typeof messages === "string") {
          Toast.show({
            type: "error",
            text1: messages,
          });
        } else {
          Toast.show({
            type: "error",
            text1:
              "Hubo un error al momento de crear el usuario. Inténtalo de nuevo.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado, contacte con el administrador",
        });
      }
    },
  });

  const handleCountryChange = (value: string) => {
    setValue("pais", value);
    resetField("departamento");
    resetField("municipio");
  };

  const handleDepartmentChange = (value: string) => {
    setValue("departamento", value);
    resetField("municipio");
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
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView
          style={[
            styles.header,
            { marginTop: height * 0.05, backgroundColor: colors.background },
          ]}
        >
          <ThemedText type="title" style={styles.title}>
            Crear Usuario
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={[styles.formContainer, { backgroundColor: colors.background }]}
        >
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
            secureTextEntry
            autoCapitalize="none"
            icon="lock-closed-outline"
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
            icon="transgender-outline"
            items={sexos}
            selectedValue={watch("sexo")}
            onValueChange={(text) => setValue("sexo", text)}
            placeholder="Selecciona un sexo"
            error={errors.sexo?.message}
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
              placeholder={
                loadingDeptos
                  ? "Cargando departamentos..."
                  : "Selecciona un departamento"
              }
              error={errors.departamento?.message}
            />
          )}

          {departamentoId && (
            <ThemedPicker
              icon="location-outline"
              items={municipalityItems}
              selectedValue={watch("municipio")}
              onValueChange={(value) => setValue("municipio", value)}
              placeholder={
                loadingMunicipios
                  ? "Cargando municipios..."
                  : "Selecciona un municipio"
              }
              error={errors.municipio?.message}
            />
          )}

          <ThemedPicker
            icon="people-circle-outline"
            items={rolesItems}
            selectedValue={watch("role") ?? ""}
            onValueChange={(value) => setValue("role", value)}
            placeholder="Selecciona un rol"
            error={errors.role?.message}
          />

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
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <ThemedButton
            title="Crear usuario"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            icon="person-add-outline"
            loading={mutation.isPending}
          />
        </ThemedView>
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
  errorContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  exampleText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
});

export default FormCreateUser;
