import { UserUpdateData } from "@/core/auth/interfaces/user";
import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import {
  actualizarUsuario,
  obtenerUsuarioById,
} from "@/core/users/accions/get-user-byId";
import { Roles } from "@/helpers/data/roles";
import { UsersStackParamList } from "@/presentation/navigation/types";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { RouteProp } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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
  const { userId } = route.params;
  const { height } = useWindowDimensions();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => obtenerUsuarioById(userId),
    retry: 0,
  });

  const { data: paises } = useQuery({
    queryKey: ["paises"],
    queryFn: obtenerPaises,
    staleTime: 60 * 100 * 5,
    retry: 0,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UserUpdateData>();

  useEffect(() => {
    if (user) {
      reset({
        email: user.data.email,
        name: user.data.name,
        identificacion: user.data.identificacion,
        direccion: user.data.direccion,
        telefono: user.data.telefono,
        rol: user.data.rol,
        pais: user.data.pais.id,
        isActive: user.data.isActive,
        isAuthorized: user.data.isAuthorized,
      });
    }
  }, [user, reset]);

  const countryItems =
    paises?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id,
    })) || [];

  const rolesItems = Roles.map((rol) => ({
    label: rol.rol,
    value: rol.rol,
  }));

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
        rol: updatedUser.rol,
        pais: updatedUser.pais.id,
      });
      queryClient.invalidateQueries({ queryKey: ["usuario", userId] });
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Usuario actualizado correctamente",
      });
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
        rol: user?.data.rol || "",
        pais: user?.data.pais.id || "",
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
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.errorText}>
          Error al cargar los datos del usuario
        </ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.header, { marginTop: height * 0.05 }]}>
          <ThemedText type="title" style={styles.title}>
            {isEditing ? "Editar Usuario" : "Detalles del Usuario"}
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
            icon="earth-outline"
            items={countryItems}
            selectedValue={watch("pais")}
            onValueChange={(value) => setValue("pais", value)}
            placeholder="Selecciona un país"
            error={errors.pais?.message}
            enabled={isEditing}
          />

          <ThemedPicker
            icon="people-circle-outline"
            items={rolesItems}
            selectedValue={watch("rol") ?? ""}
            onValueChange={(value) => setValue("rol", value)}
            placeholder="Selecciona un rol"
            error={errors.rol?.message}
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

          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>Activo:</ThemedText>
            <Switch
              value={watch("isActive")}
              onValueChange={(value) => setValue("isActive", value)}
              disabled={!isEditing}
              thumbColor={watch("isActive") ? "#4CAF50" : "#f44336"}
            />
          </View>

          <View style={styles.switchContainer}>
            <ThemedText style={styles.switchLabel}>Autorizado:</ThemedText>
            <Switch
              value={watch("isAuthorized")}
              onValueChange={(value) => setValue("isAuthorized", value)}
              disabled={!isEditing}
              thumbColor={watch("isAuthorized") ? "#4CAF50" : "#f44336"}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#f9f9f9",
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
