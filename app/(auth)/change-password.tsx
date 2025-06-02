import { CambiarContraseña } from "@/core/users/accions/update-password";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface ChangePasswordData {
  email: string;
  nuevaContrasena: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const { height } = useWindowDimensions();
  const [form, setForm] = useState({
    email: "",
    nuevaContrasena: "",
    confirmPassword: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (
      passwordData: Omit<ChangePasswordData, "confirmPassword">
    ) => {
      return CambiarContraseña({
        email: passwordData.email,
        nuevaContrasena: passwordData.nuevaContrasena,
      });
    },
    onSuccess: () => {
      Alert.alert("Éxito", "Contraseña actualizada correctamente");

      setForm({ email: "", nuevaContrasena: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data
            ? error.response?.data.message
            : "Ocurrió un error al cambiar la contraseña"
        );
      }
    },
  });

  const handleUpdate = async () => {
    if (!form.email || !form.nuevaContrasena || !form.confirmPassword) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }

    if (form.nuevaContrasena !== form.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    changePasswordMutation.mutate({
      email: form.email,
      nuevaContrasena: form.nuevaContrasena,
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 40 }}>
        <View style={{ paddingTop: height * 0.3 }}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: "KanitBold",
              fontWeight: "bold",
            }}
          >
            Restablecer Contraseña
          </Text>
          <ThemedText style={{ color: "gray" }}>
            Por favor, ingresa tus datos correctamente
          </ThemedText>
        </View>

        <View>
          <View style={{ marginTop: 20 }}>
            <ThemedTextInput
              placeholder="correo electronico"
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <ThemedTextInput
              placeholder="Contraseña"
              secureTextEntry
              autoCapitalize="none"
              icon="lock-closed-outline"
              value={form.nuevaContrasena}
              onChangeText={(value) =>
                setForm({ ...form, nuevaContrasena: value })
              }
            />
            <ThemedTextInput
              placeholder="Confirmar Contraseña"
              secureTextEntry
              autoCapitalize="none"
              icon="lock-closed-outline"
              value={form.confirmPassword}
              onChangeText={(value) =>
                setForm({ ...form, confirmPassword: value })
              }
            />
          </View>
        </View>
        <View>
          <ThemedButton
            title="Actualizar"
            onPress={handleUpdate}
            disabled={changePasswordMutation.isPending}
            variant="primary"
            icon="reload-outline"
            loading={false}
            style={{ marginTop: 20 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿No tienes cuenta?</ThemedText>
          <ThemedLink href="/(auth)/register" style={{ marginLeft: 5 }}>
            Crear Cuenta
          </ThemedLink>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText>¿Ya tienes una cuenta?</ThemedText>
          <ThemedLink href="/(auth)/login" style={{ marginLeft: 5 }}>
            Inicia Sesion
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordPage;
