import { CustomToast } from "@/presentation/theme/components/CustomToast";
import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { AuthProvider } from "@/providers/AuthProvider";
import PermissionsCheckerProvider from "@/providers/PermissionsCheckerProvider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    KanitRegular: require("../assets/fonts/Kanit-Regular.ttf"),
    KanitBold: require("../assets/fonts/Kanit-Bold.ttf"),
    KanitThin: require("../assets/fonts/Kanit-Thin.ttf"),
  });

  if (!loaded) return null;

  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <PermissionsCheckerProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ backgroundColor, flex: 1 }}>
            <PaperProvider>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                ></Stack>
                <Toast
                  config={{
                    success: (props) => <CustomToast {...props} />,
                    error: (props) => <CustomToast {...props} />,
                    info: (props) => <CustomToast {...props} />,
                  }}
                />
                <StatusBar style="auto" />
              </ThemeProvider>
            </PaperProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </PermissionsCheckerProvider>
    </AuthProvider>
  );
}
