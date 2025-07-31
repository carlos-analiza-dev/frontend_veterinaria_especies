import { UserUpdateData } from "@/core/auth/interfaces/user";
import { actualizarUsuario } from "@/core/users/accions/get-user-byId";
import { sexosData } from "@/helpers/data/sexo";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import useGetRoles from "@/hooks/roles/useGetRoles";
import userById from "@/hooks/users/userById";
import MessageError from "@/presentation/components/MessageError";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { RouteProp, useTheme } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type UserDetailsRouteProp = RouteProp<UsersStackParamList, "UserDetails">;

interface UserDetailsScreenProps {
  route: UserDetailsRouteProp;
}

const UsersDetailsScreen = ({ route }: UserDetailsScreenProps) => {
  const { colors } = useTheme();
  const { userId } = route.params;
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  const { data: user, isError, isLoading } = userById(userId);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    resetField,
  } = useForm<UserUpdateData>();

  const paisId = watch("pais");
  const departamentoId = watch("departamento");

  const { data } = useGetPaisesActivos();

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

  useEffect(() => {
    if (user) {
      reset({
        email: user.data.email,
        name: user.data.name,
        identificacion: user.data.identificacion,
        direccion: user.data.direccion,
        telefono: user.data.telefono,
        role: user.data.role.id,
        pais: user.data.pais.id,
        sexo: user.data.sexo,
        departamento: user.data.departamento?.id || "",
        municipio: user.data.municipio?.id || "",
        isActive: user.data.isActive,
        isAuthorized: user.data.isAuthorized,
      });
    }
  }, [user, reset]);

  const handleCountryChange = (value: string) => {
    setValue("pais", value);
    resetField("departamento");
    resetField("municipio");
  };

  const handleDepartmentChange = (value: string) => {
    setValue("departamento", value);
    resetField("municipio");
  };

  const updateMutation = useMutation({
    mutationFn: (updatedData: UserUpdateData) =>
      actualizarUsuario(userId, updatedData),
    onSuccess: (updatedUser) => {
      reset({
        email: updatedUser.email,
        name: updatedUser.name,
        identificacion: updatedUser.identificacion,
        direccion: updatedUser.direccion,
        telefono: updatedUser.telefono,
        role: updatedUser.role.id,
        pais: updatedUser.pais.id,
        departamento: updatedUser.departamento?.id || "",
        municipio: updatedUser.municipio?.id || "",
        isActive: updatedUser.isActive,
        isAuthorized: updatedUser.isAuthorized,
      });
      queryClient.invalidateQueries({ queryKey: ["usuario", userId] });
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Usuario actualizado correctamente",
      });
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
            text1: "Error al actualizar el usuario",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado al actualizar",
        });
      }
    },
  });

  const onSubmit = (data: UserUpdateData) => {
    updateMutation.mutate(data);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      reset({
        email: user?.data.email || "",
        name: user?.data.name || "",
        identificacion: user?.data.identificacion || "",
        direccion: user?.data.direccion || "",
        telefono: user?.data.telefono || "",
        role: user?.data.role.name || "",
        pais: user?.data.pais.id || "",
        departamento: user?.data.departamento?.id || "",
        municipio: user?.data.municipio?.id || "",
        isActive: user?.data.isActive,
        isAuthorized: user?.data.isAuthorized,
      });
    }
    setIsEditing(!isEditing);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <MessageError
        titulo="Error al cargar los datos del usuario"
        descripcion="No se encontraron datos del usuario en este módulo. Por favor, verifica más tarde o intenta nuevamente."
      />
    );
  }

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
            {isEditing ? "Editar Usuario" : "Detalles del Usuario"}
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
            editable={isEditing}
          />

          <ThemedTextInput
            placeholder="Nombre completo"
            autoCapitalize="words"
            icon="person-outline"
            value={watch("name")}
            onChangeText={(text) => setValue("name", text)}
            error={errors.name?.message}
            editable={isEditing}
          />

          <ThemedPicker
            icon="transgender-outline"
            items={sexos}
            selectedValue={watch("sexo")}
            onValueChange={(text) => setValue("sexo", text)}
            placeholder="Selecciona el sexo"
            error={errors.sexo?.message}
            enabled={isEditing}
          />

          <ThemedPicker
            icon="earth-outline"
            items={countryItems}
            selectedValue={watch("pais")}
            onValueChange={handleCountryChange}
            placeholder="Selecciona un país"
            error={errors.pais?.message}
            enabled={isEditing}
          />

          {(paisId || user.data.departamento) && (
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
              enabled={isEditing && !loadingDeptos}
            />
          )}

          {(departamentoId || user.data.municipio) && (
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
              enabled={isEditing && !loadingMunicipios}
            />
          )}

          <ThemedPicker
            icon="people-circle-outline"
            items={rolesItems}
            selectedValue={watch("role") ?? ""}
            onValueChange={(value) => setValue("role", value)}
            placeholder="Selecciona un rol"
            error={errors.role?.message}
            enabled={isEditing}
          />

          <ThemedTextInput
            placeholder="DNI (12345678-9)"
            icon="id-card-outline"
            keyboardType="numeric"
            value={watch("identificacion")}
            onChangeText={(text) => setValue("identificacion", text)}
            error={errors.identificacion?.message}
            editable={isEditing}
          />

          <ThemedTextInput
            placeholder="Dirección"
            icon="location-outline"
            value={watch("direccion")}
            onChangeText={(text) => setValue("direccion", text)}
            error={errors.direccion?.message}
            editable={isEditing}
          />

          <ThemedTextInput
            placeholder="Teléfono (912345678)"
            icon="call-outline"
            keyboardType="phone-pad"
            value={watch("telefono")}
            onChangeText={(text) => setValue("telefono", text)}
            error={errors.telefono?.message}
            editable={isEditing}
          />

          <ThemedView
            style={[
              styles.switchContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <ThemedText style={styles.switchLabel}>Activo:</ThemedText>
            <Switch
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value)}
              disabled={!isEditing}
              thumbColor={watch("isActive") ? "#4CAF50" : "#f44336"}
              trackColor={{ false: "#ccc", true: "#ccc" }}
            />
          </ThemedView>

          <ThemedView
            style={[
              styles.switchContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <ThemedText style={styles.switchLabel}>Autorizado:</ThemedText>
            <Switch
              value={watch("isAuthorized")}
              onValueChange={(value) => setValue("isAuthorized", value)}
              disabled={!isEditing}
              thumbColor={watch("isAuthorized") ? "#4CAF50" : "#f44336"}
              trackColor={{ false: "#ccc", true: "#ccc" }}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <ThemedButton
                title="Guardar Cambios"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                icon="save-outline"
                loading={updateMutation.isPending}
              />
              <ThemedButton
                title="Cancelar"
                onPress={handleEditToggle}
                variant="outline"
                icon="close-circle-outline"
                style={styles.cancelButton}
                disabled={updateMutation.isPending}
              />
            </>
          ) : (
            <ThemedButton
              title="Editar Usuario"
              onPress={handleEditToggle}
              variant="primary"
              icon="create-outline"
            />
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,

    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  formContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginTop: 20,
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
});

export default UsersDetailsScreen;
