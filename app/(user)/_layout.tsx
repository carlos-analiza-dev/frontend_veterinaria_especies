import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { createStackNavigator } from "@react-navigation/stack";

import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Redirect } from "expo-router";

import GoBack from "@/presentation/components/GoBack";
import AnimalesPageGanadero from "./animales/animales-page";
import CustomDrawerUsers from "./components/CustomDrawerUsers";
import CrearFincaPage from "./finca/crear-finca";
import FincasPageGanaderos from "./finca/fincas-page";
import HomeUser from "./home";
import ProfileUser from "./profile";

const Drawer = createDrawerNavigator();

export default function UserLayout() {
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const UsersStack = createStackNavigator<UsersStackParamList>();

  const UsersCitasStackScreen = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="home"
          component={HomeUser}
          options={{
            headerShown: true,
            headerTitle: "Ganadero",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
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
      </UsersStack.Navigator>
    );
  };

  return (
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
  );
}
