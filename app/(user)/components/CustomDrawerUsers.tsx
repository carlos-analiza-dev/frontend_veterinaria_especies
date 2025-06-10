import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

type Props = DrawerContentComponentProps & {
  logout: () => void;
};

const CustomDrawerUsers = ({ navigation, logout }: Props) => {
  const { colors } = useTheme();

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ThemedText style={[styles.title]}>Menú Ganadero</ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("home")}
      >
        <MyIcon
          name="calendar-number-outline"
          size={24}
          color={colors.primary}
        />
        <ThemedText style={[styles.itemText]}>Agendar Cita</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("fincas-page")}
      >
        <MyIcon name="podium-outline" size={24} color={colors.primary} />
        <ThemedText style={[styles.itemText]}>Fincas</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("animales-page")}
      >
        <MyIcon name="paw-outline" size={24} color={colors.primary} />
        <ThemedText style={[styles.itemText]}>Animales</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("profile")}
      >
        <MyIcon name="person-outline" size={24} color={colors.primary} />
        <ThemedText style={[styles.itemText]}>Perfil</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={logout}
      >
        <MyIcon name="log-out-outline" size={24} color="#ff4444" />
        <ThemedText style={[styles.itemText, styles.logoutText]}>
          Cerrar Sesión
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default CustomDrawerUsers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    borderBottomWidth: 1,
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
