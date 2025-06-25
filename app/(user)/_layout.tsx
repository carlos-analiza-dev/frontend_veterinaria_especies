import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { createStackNavigator } from "@react-navigation/stack";

import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Redirect, router } from "expo-router";

import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import { TokenExpiredModal } from "@/presentation/auth/components/TokenExpiredModal";
import GoBack from "@/presentation/components/GoBack";
import { useEffect, useState } from "react";
import AnimalDetailsPage from "./animales/animal-details";
import AnimalesPageGanadero from "./animales/animales-page";
import CrearAnimal from "./animales/crear-animal";

import CrearCita from "./citas/crear-cita";
import HomeUser from "./citas/home";
import CustomDrawerUsers from "./components/CustomDrawerUsers";
import CrearFincaPage from "./finca/crear-finca";
import FincaDetailsPage from "./finca/finca-details";
import FincasPageGanaderos from "./finca/fincas-page";
import ProfileUser from "./profile";

const Drawer = createDrawerNavigator();

export default function UserLayout() {
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

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const UsersStack = createStackNavigator<UsersStackParamList>();

  const UsersCitasStackScreen = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="CitasPage"
          component={HomeUser}
          options={{
            headerShown: true,
            headerTitle: "Citas",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
        <UsersStack.Screen
          name="CrearCita"
          component={CrearCita}
          options={{
            headerShown: true,
            headerTitle: "Agendar Cita",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
      </UsersStack.Navigator>
    );
  };

  const UsersFincasStackScreen = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="FincasPage"
          component={FincasPageGanaderos}
          options={{
            headerShown: true,
            headerTitle: "Fincas",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
        <UsersStack.Screen
          name="CrearFincaPage"
          component={CrearFincaPage}
          options={{
            headerShown: true,
            headerTitle: "Agregar Finca",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="FincaDetailsPage"
          component={FincaDetailsPage}
          options={{
            headerShown: true,
            headerTitle: "Detalles Finca",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
      </UsersStack.Navigator>
    );
  };

  const UsersAnimalesStackScreen = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="AnimalesPage"
          component={AnimalesPageGanadero}
          options={{
            headerShown: true,
            headerTitle: "Animales",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />

        <UsersStack.Screen
          name="CrearAnimal"
          component={CrearAnimal}
          options={{
            headerShown: true,
            headerTitle: "Agregar Animal",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />

        <UsersStack.Screen
          name="AnimalDetails"
          component={AnimalDetailsPage}
          options={{
            headerShown: true,
            headerTitle: "Detalles Animal",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
      </UsersStack.Navigator>
    );
  };

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerUsers {...props} logout={logout} />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="home" component={UsersCitasStackScreen} />
        <Drawer.Screen name="fincas-page" component={UsersFincasStackScreen} />
        <Drawer.Screen
          name="animales-page"
          component={UsersAnimalesStackScreen}
        />
        <Drawer.Screen
          name="profile"
          component={ProfileUser}
          options={{
            headerShown: true,
            headerTitle: "Ganadero Perfil",
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
