import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import { TokenExpiredModal } from "@/presentation/auth/components/TokenExpiredModal";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import CitasPendientesVeterinario from "./citas-veterinario/citas-pendientes";
import CustomDrawerVeterinario from "./components/CustomDrawerVeterinario";
import PerfilMedico from "./perfil-veterinario/perfil-vet";

const Drawer = createDrawerNavigator();

export default function VeterinarioLayout() {
  const { user, logout, token } = useAuthStore();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      setSessionExpired(true);
    }

    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        setSessionExpired(true);
      }
    });

    return () => clearInterval(interval);
  }, [token]);

  if (user?.role.name !== "Veterinario") {
    return <Redirect href="/login" />;
  }

  const VeterinarioStack = createStackNavigator<UsersStackParamList>();

  const VeterinarioStackHome = () => {
    return (
      <VeterinarioStack.Navigator screenOptions={{ headerShown: false }}>
        <VeterinarioStack.Screen
          name="CitasPendientesVeterinario"
          component={CitasPendientesVeterinario}
          options={{
            headerShown: true,
            headerTitle: "Citas Pendientes",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
      </VeterinarioStack.Navigator>
    );
  };

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerVeterinario {...props} logout={logout} />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen
          name="citas-pendientes"
          component={VeterinarioStackHome}
        />
        <Drawer.Screen
          name="perfil-vet"
          component={PerfilMedico}
          options={{
            headerShown: true,
            headerTitle: "Veterinario Perfil",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
      </Drawer.Navigator>

      <TokenExpiredModal
        visible={sessionExpired}
        onConfirm={() => {
          logout();
          router.replace("/login");
          setSessionExpired(false);
        }}
      />
    </>
  );
}
