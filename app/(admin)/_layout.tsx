import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import LogoutIconButton from "@/presentation/auth/components/LogoutIconButton";
import { TokenExpiredModal } from "@/presentation/auth/components/TokenExpiredModal";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import GoBack from "@/presentation/components/GoBack";
import { UsersStackParamList } from "@/presentation/navigation/types";
import { useColorScheme } from "@/presentation/theme/hooks/useColorScheme.web";
import {
  createDrawerNavigator,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import AgregarDepartamentoPais from "./agregar-departamento-pais";
import CustomDrawerContent from "./components/CustomDrawerContent";
import CrearPaisPage from "./crea-pais";
import CrearUsuarioScreen from "./crear-usuario";
import DashboardAdminPage from "./dashboard";
import CrearMedicoPage from "./medicos/crear-medico";
import DetailsMedico from "./medicos/details-medico";
import MedicosPage from "./medicos/medicos-page";
import PaisDetailsPage from "./paise-dateails";
import PaisesPage from "./paises-page";
import PerfilAdminPage from "./perfil-admin";
import RolesPageAdmin from "./roles/roles-page";
import ServicioPageAdmin from "./servicios/servicios-page";
import SubServiciosPage from "./servicios/sub-servicio-page";
import SettingsScreen from "./settings";
import UsersDetailsScreen from "./user-details";
import UsersScreenAdmin from "./users";

const Drawer = createDrawerNavigator();

export default function AdminLayout() {
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

  const AdminStackScreenMedicos = () => {
    return (
      <UsersStack.Navigator screenOptions={{ headerShown: false }}>
        <UsersStack.Screen
          name="MedicosPage"
          component={MedicosPage}
          options={{
            headerShown: true,
            headerTitle: "Admin Medicos",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />
        <UsersStack.Screen
          name="CrearMedicoPage"
          component={CrearMedicoPage}
          options={{
            headerShown: true,
            headerTitle: "Crear Medico",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <GoBack />,
          }}
        />
        <UsersStack.Screen
          name="DetailsMedico"
          component={DetailsMedico}
          options={{
            headerShown: true,
            headerTitle: "Detalles Medico",
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
            headerTitle: "Admin Categorias",
            headerRight: () => <LogoutIconButton />,
            headerLeft: () => <DrawerToggleButton tintColor={iconColor} />,
          }}
        />

        <UsersStack.Screen
          name="AgregarSubServicio"
          component={SubServiciosPage}
          options={{
            headerShown: true,
            headerTitle: "Agregar Servicio",
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
          name="medicos-page"
          component={AdminStackScreenMedicos}
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
