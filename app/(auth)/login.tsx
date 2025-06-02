import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { login, logout } = useAuthStore();
  const { height } = useWindowDimensions();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isPosting, setIsPosting] = useState(false);

  const handleLogin = async () => {
    const { email, password } = form;

    if (form.email.length === 0 || form.password.length === 0) {
      Toast.show({
        type: "error",
        text1: "Campos requeridos",
        text2: "Debes ingresar correo y contraseña.",
      });
      return;
    }

    setIsPosting(true);
    const authResponse = await login(email, password);
    setIsPosting(false);

    if (authResponse) {
      const { user, token } = authResponse;
      if (user.rol === "Administrador") {
        router.replace("/(admin)/users");
      } else if (user.rol === "User") {
        router.replace("/(user)/home");
      } else if (user.rol === "Secretario") {
        router.replace("/(secretario)/home");
      } else if (user.rol === "Veterinario") {
        router.replace("/(veterinario)/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Acceso denegado",
          text2: "No tienes permisos para acceder a esta aplicación.",
        });

        await logout();
      }
      return;
    }
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Usuario o contraseña incorrectos. Contacte al administrador.",
    });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView style={{ paddingHorizontal: 40 }}>
        <View style={{ paddingTop: height * 0.35 }}>
          <ThemedText type="title">Ingresar</ThemedText>
          <ThemedText style={{ color: "gray" }}>
            Por favor, ingrese para continuar
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
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
          </View>
        </View>
        <View>
          <ThemedButton
            title="Ingresar"
            onPress={handleLogin}
            disabled={isPosting}
            variant="primary"
            icon="log-in-outline"
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
          <ThemedText>¿Olvidaste tu contraseña?</ThemedText>
          <ThemedLink href="/(auth)/change-password" style={{ marginLeft: 5 }}>
            Cambiar
          </ThemedLink>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
