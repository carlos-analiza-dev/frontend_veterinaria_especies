import { CambiarContraseña } from "@/core/users/accions/update-password";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
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
    <ImageBackground
      source={require("@/images/Ganaderia.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.formContainer, { marginTop: height * 0.2 }]}>
            <ThemedText
              style={{
                fontSize: 22,
                fontFamily: "KanitBold",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              Restablecer Contraseña
            </ThemedText>
            <ThemedText style={{ textAlign: "center", marginBottom: 20 }}>
              Por favor, ingresa tus datos correctamente
            </ThemedText>

            <View style={styles.inputsContainer}>
              <ThemedTextInput
                placeholder="Correo electrónico"
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

            <ThemedButton
              title="Actualizar"
              onPress={handleUpdate}
              disabled={changePasswordMutation.isPending}
              variant="primary"
              icon="reload-outline"
              loading={changePasswordMutation.isPending}
              style={styles.loginButton}
            />

            <View style={styles.linksContainer}>
              <View style={styles.linkRow}>
                <ThemedText>¿No tienes cuenta?</ThemedText>
                <ThemedLink href="/(auth)/register" style={styles.link}>
                  Crear Cuenta
                </ThemedLink>
              </View>
              <View style={styles.linkRow}>
                <ThemedText>¿Ya tienes una cuenta?</ThemedText>
                <ThemedLink href="/(auth)/login" style={styles.link}>
                  Inicia Sesión
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
    paddingHorizontal: 40,
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
});

export default ChangePasswordPage;
