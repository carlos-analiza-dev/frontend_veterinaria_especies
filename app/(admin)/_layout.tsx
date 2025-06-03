import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { UsersStackParamList } from "@/presentation/navigation/types";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Redirect } from "expo-router";
import CustomDrawerContent from "./components/CustomDrawerContent";
import SettingsScreen from "./settings";

import GoBack from "@/presentation/components/GoBack";
import CrearPaisPage from "./crea-pais";
import CrearUsuarioScreen from "./crear-usuario";
import DashboardAdminPage from "./dashboard";
import PaisDetailsPage from "./paise-dateails";
import PaisesPage from "./paises-page";
import UsersDetailsScreen from "./user-details";
import UsersScreenAdmin from "./users";

const Drawer = createDrawerNavigator();

export default function AdminLayout() {
  const { user, logout } = useAuthStore();

  if (user?.rol !== "Administrador") {
    return <Redirect href="/login" />;
  }

  const UsersStack = createStackNavigator<UsersStackParamList>();

  const AdminStackScreen = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="users"
          component={UsersScreenAdmin}
          options={{
            headerShown: true,
            headerTitle: "Admin Panel",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor="black" />,
          }}
        />
        <UsersStack.Screen
          name="UserDetails"
          component={UsersDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: "Detalles Usuarios",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="CrearUsuario"
          component={CrearUsuarioScreen}
          options={{
            headerShown: true,
            headerTitle: "Crear Usuarios",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
      </UsersStack.Navigator>
    );
  };

  const AdminStackScreenPaises = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="PaisesPage"
          component={PaisesPage}
          options={{
            headerShown: true,
            headerTitle: "Admin Paises",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor="black" />,
          }}
        />
        <UsersStack.Screen
          name="PaisDetails"
          component={PaisDetailsPage}
          options={{
            headerShown: true,
            headerTitle: "Detalles Pais",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="CrearPais"
          component={CrearPaisPage}
          options={{
            headerShown: true,
            headerTitle: "Crear Pais",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
      </UsersStack.Navigator>
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} logout={logout} />
      )}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="dashboard"
        component={DashboardAdminPage}
        options={{
          headerShown: true,
          headerTitle: "Admin Dashboard",
          headerRight: () => <LogoutIconButton />,
          headerLeft: () => <DrawerToggleButton tintColor="black" />,
        }}
      />
      <Drawer.Screen name="users" component={AdminStackScreen} />
      <Drawer.Screen name="paises-page" component={AdminStackScreenPaises} />
      <Drawer.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: "Admin Settings",
          headerRight: () => <LogoutIconButton />,
          headerLeft: () => <DrawerToggleButton tintColor="black" />,
        }}
      />
    </Drawer.Navigator>
  );
}
