import { CambiarContraseña } from "@/core/users/accions/update-password";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface ChangePasswordData {
  email: string;
  nuevaContrasena: string;
  confirmPassword: string;
}

const ChangePasswordPage = () => {
  const { height } = useWindowDimensions();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswor2, setShowPasswor2] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordTwo = () => {
    setShowPasswor2(!showPasswor2);
  };

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
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Contraseña actualizada correctamente",
      });

      setForm({ email: "", nuevaContrasena: "", confirmPassword: "" });
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
              "Hubo un error al momento de actualizar la contraseña. Inténtalo de nuevo.",
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

  const handleUpdate = async () => {
    if (!form.email || !form.nuevaContrasena || !form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos son requeridos",
      });
      return;
    }

    if (form.nuevaContrasena !== form.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
      });
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
          <ThemedText
            style={{
              fontSize: 25,
              fontFamily: "KanitBold",
              fontWeight: "bold",
            }}
          >
            Restablecer Contraseña
          </ThemedText>
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
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              icon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={toggleShowPassword}
              value={form.nuevaContrasena}
              onChangeText={(value) =>
                setForm({ ...form, nuevaContrasena: value })
              }
            />
            <ThemedTextInput
              placeholder="Confirmar Contraseña"
              secureTextEntry={!showPasswor2}
              autoCapitalize="none"
              icon="lock-closed-outline"
              rightIcon={showPasswor2 ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={toggleShowPasswordTwo}
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
