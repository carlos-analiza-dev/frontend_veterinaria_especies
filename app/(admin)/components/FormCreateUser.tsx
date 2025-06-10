import { obtenerDeptosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { obtenerMunicipiosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { getRoles } from "@/core/roles/accions/all-roles";
import { CreateUser } from "@/core/users/accions/crear-usuario";
import { CrearUsuario } from "@/core/users/interfaces/create-user.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    resetField,
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
  });

  const paisId = watch("pais");
  const departamentoId = watch("departamento");

  const { data } = useQuery({
    queryKey: ["paises"],
    queryFn: obtenerPaises,
    staleTime: 60 * 100 * 5,
    retry: 0,
  });

  const { data: departamentos, isLoading: loadingDeptos } = useQuery({
    queryKey: ["departamentos", paisId],
    queryFn: () => obtenerDeptosPaisById(paisId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!paisId,
  });

  const { data: municipios, isLoading: loadingMunicipios } = useQuery({
    queryKey: ["municipios", departamentoId],
    queryFn: () => obtenerMunicipiosDeptoById(departamentoId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!departamentoId,
  });

  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
    staleTime: 60 * 100 * 5,
    retry: 0,
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

  const rolesItems =
    roles?.data.map((rol) => ({
      label: rol.name,
      value: rol.id.toString(),
    })) || [];

  const mutation = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      Toast.show({ type: "success", text1: "Usuario creado exitosamente." });
      router.push("/(admin)/users");
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
    mutation.mutate(data);
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

          <ThemedTextInput
            placeholder="DNI (12345678-9)"
            icon="id-card-outline"
            keyboardType="numeric"
            value={watch("identificacion")}
            onChangeText={(text) => setValue("identificacion", text)}
            error={errors.identificacion?.message}
          />

          <ThemedTextInput
            placeholder="Dirección"
            icon="location-outline"
            value={watch("direccion")}
            onChangeText={(text) => setValue("direccion", text)}
            error={errors.direccion?.message}
          />

          <ThemedTextInput
            placeholder="Teléfono (912345678)"
            icon="call-outline"
            keyboardType="phone-pad"
            value={watch("telefono")}
            onChangeText={(text) => setValue("telefono", text)}
            error={errors.telefono?.message}
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
});

export default FormCreateUser;
