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
import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import AgregarDepartamentoPais from "./agregar-departamento-pais";
import CrearPaisPage from "./crea-pais";
import CrearUsuarioScreen from "./crear-usuario";
import DashboardAdminPage from "./dashboard";
import PaisDetailsPage from "./paise-dateails";
import PaisesPage from "./paises-page";
import PerfilAdminPage from "./perfil-admin";
import RolesPageAdmin from "./roles/roles-page";
import AddPriceServices from "./servicios/agregar-precio-services";
import CrearServicioPage from "./servicios/crear-servicio";
import DetailsServices from "./servicios/details-services";
import ServicioPageAdmin from "./servicios/servicios-page";
import UsersDetailsScreen from "./user-details";
import UsersScreenAdmin from "./users";

const Drawer = createDrawerNavigator();

export default function AdminLayout() {
  const { user, logout } = useAuthStore();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";

  if (user?.role.name !== "Administrador") {
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
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
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
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
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
          name="AgregarDeptoPais"
          component={AgregarDepartamentoPais}
          options={{
            headerShown: true,
            headerTitle: "Agregar Departamento",
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

  const AdminStackScreenServicios = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="ServiciosAdmin"
          component={ServicioPageAdmin}
          options={{
            headerShown: true,
            headerTitle: "Admin Servicios",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
        <UsersStack.Screen
          name="DetailsServicio"
          component={DetailsServices}
          options={{
            headerShown: true,
            headerTitle: "Detalles Servicios",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="CrearServicio"
          component={CrearServicioPage}
          options={{
            headerShown: true,
            headerTitle: "Agregar Servicio",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="AgregarPreciosServices"
          component={AddPriceServices}
          options={{
            headerShown: true,
            headerTitle: "Agregar Precios",
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
          headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
        }}
      />
      <Drawer.Screen name="users" component={AdminStackScreen} />
      <Drawer.Screen name="paises-page" component={AdminStackScreenPaises} />
      <Drawer.Screen
        name="roles-page"
        component={RolesPageAdmin}
        options={{
          headerShown: true,
          headerTitle: "Admin Roles",
          headerRight: () => <LogoutIconButton />,
          headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: "Admin Settings",
          headerRight: () => <LogoutIconButton />,
          headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
        }}
      />
      <Drawer.Screen
        name="servicios-page"
        component={AdminStackScreenServicios}
      />
      <Drawer.Screen
        name="perfil-admin"
        component={PerfilAdminPage}
        options={{
          headerShown: true,
          headerTitle: "Admin Perfil",
          headerRight: () => <LogoutIconButton />,
          headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
        }}
      />
    </Drawer.Navigator>
  );
}
