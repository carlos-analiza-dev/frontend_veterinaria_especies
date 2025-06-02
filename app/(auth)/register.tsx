import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { CreateUser } from "@/core/users/accions/crear-usuario";
import { CrearUsuario } from "@/core/users/interfaces/create-user.interface";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CrearUsuario>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      pais: "",
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["paises"],
    queryFn: obtenerPaises,
    staleTime: 60 * 100 * 5,
    retry: 0,
  });

  const countryItems =
    data?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id.toString(),
    })) || [];

  const mutation = useMutation({
    mutationFn: CreateUser,
    onSuccess: () => {
      Alert.alert("Éxito", "Usuario creado correctamente");
      router.push("/(auth)/login");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        if (Array.isArray(messages)) {
          Alert.alert("Errores de validación", messages.join("\n"));
        } else if (typeof messages === "string") {
          Alert.alert("Error", messages);
        } else {
          Alert.alert(
            "Error",
            "Hubo un error al momento de crear el usuario. Inténtalo de nuevo."
          );
        }
      } else {
        Alert.alert("Error", "Error inesperado, contacte con el administrador");
      }
    },
  });

  const onSubmit = (data: CrearUsuario) => {
    mutation.mutate(data);
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
            onValueChange={(value) => setValue("pais", value)}
            placeholder="Selecciona un país"
            error={errors.pais?.message}
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
    backgroundColor: "#fff",
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
