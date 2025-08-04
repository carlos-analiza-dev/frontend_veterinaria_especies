import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedLink from "@/presentation/theme/components/ThemedLink";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const LoginScreen = () => {
  const { login, logout } = useAuthStore();
  const { height, width } = useWindowDimensions();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isPosting, setIsPosting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

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
      const { user } = authResponse;

      switch (user.role.name) {
        case "Administrador":
          router.replace("/(admin)/users");
          break;
        case "Ganadero":
          router.replace("/(user)/servicios-user/servicios-user");
          break;
        case "Secretario":
          router.replace("/(secretario)/home");
          break;
        case "Veterinario":
          router.replace("/(veterinario)/citas-veterinario/citas-pendientes");
          break;
        default:
          Toast.show({
            type: "error",
            text1: "Acceso denegado",
            text2: "No tienes permisos para acceder a esta aplicación.",
          });
          await logout();
          break;
      }

      return;
    }
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Usuario o contraseña incorrectos. Contacte al administrador.",
    });
  };

  const isSmallDevice = width < 375;

  return (
    <ImageBackground
      source={require("@/images/Ganaderia.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: isSmallDevice ? 20 : 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.contentContainer,
              {
                marginTop: height * (isSmallDevice ? 0.15 : 0.25),
                minHeight: height * 0.6,
              },
            ]}
          >
            <View
              style={[
                styles.formContainer,
                {
                  padding: isSmallDevice ? 15 : 20,
                  width: isSmallDevice
                    ? width * 0.9
                    : Math.min(width * 0.85, 400),
                },
              ]}
            >
              <ThemedText
                style={[styles.title, { fontSize: isSmallDevice ? 20 : 22 }]}
                type="title"
              >
                Ingresar
              </ThemedText>
              <ThemedText
                style={[
                  styles.subtitle,
                  { marginBottom: isSmallDevice ? 15 : 20 },
                ]}
              >
                Por favor, ingrese para continuar
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
                  value={form.password}
                  onChangeText={(value) =>
                    setForm({ ...form, password: value })
                  }
                />
              </View>

              <ThemedButton
                title="Ingresar"
                onPress={handleLogin}
                disabled={isPosting}
                variant="primary"
                icon="log-in-outline"
                loading={isPosting}
                style={{
                  ...styles.loginButton,
                  marginTop: isSmallDevice ? 10 : 15,
                }}
              />

              <View style={styles.linksContainer}>
                <View style={styles.linkRow}>
                  <ThemedText style={styles.linkText}>
                    ¿No tienes cuenta?
                  </ThemedText>
                  <ThemedLink href="/(auth)/register" style={styles.link}>
                    Crear Cuenta
                  </ThemedLink>
                </View>
                <View style={styles.linkRow}>
                  <ThemedText style={styles.linkText}>
                    ¿Olvidaste tu contraseña?
                  </ThemedText>
                  <ThemedLink
                    href="/(auth)/change-password"
                    style={styles.link}
                  >
                    Cambiar
                  </ThemedLink>
                </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontFamily: "KanitBold",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
  },
  inputsContainer: {
    marginBottom: 15,
    width: "100%",
  },
  loginButton: {
    width: "100%",
    minHeight: 48,
  },
  linksContainer: {
    marginTop: 15,
    width: "100%",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  linkText: {
    textAlign: "center",
  },
  link: {
    marginLeft: 5,
  },
});

export default LoginScreen;
