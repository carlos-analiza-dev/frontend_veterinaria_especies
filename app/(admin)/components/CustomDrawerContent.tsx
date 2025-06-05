import MyIcon from "@/presentation/auth/components/MyIcon";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = DrawerContentComponentProps & {
  logout: () => void;
};

const CustomDrawerContent = ({ navigation, logout }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menú Administrador</Text>
      </View>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("dashboard")}
      >
        <MyIcon name="bar-chart-outline" size={24} color="black" />
        <Text style={styles.itemText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("users")}
      >
        <MyIcon name="people-outline" size={24} color="black" />
        <Text style={styles.itemText}>Usuarios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("paises-page")}
      >
        <MyIcon name="globe-outline" size={24} color="black" />
        <Text style={styles.itemText}>Paises</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("settings")}
      >
        <MyIcon name="settings-outline" size={24} color="black" />
        <Text style={styles.itemText}>Configuración</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("perfil-admin")}
      >
        <MyIcon name="person-outline" size={24} color="black" />
        <Text style={styles.itemText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={logout}
      >
        <MyIcon name="log-out-outline" size={24} color="#ff4444" />
        <Text style={[styles.itemText, styles.logoutText]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 30,
    justifyContent: "center",
  },
  logoutText: {
    color: "#ff4444",
  },
});

export default CustomDrawerContent;
