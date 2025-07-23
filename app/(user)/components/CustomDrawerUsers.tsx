import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { List, useTheme } from "react-native-paper";

type Props = DrawerContentComponentProps & {
  logout: () => void;
};

const CustomDrawerUsers = ({ navigation, logout }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const handleItemPress = (route: any) => {
    setExpanded(false);
    navigation.navigate(route);
  };

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
        onPress={() => navigation.navigate("servicios-user")}
      >
        <MyIcon name="hammer-outline" size={24} color={colors.primary} />
        <ThemedText style={[styles.itemText]}>Servicios Disponibles</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("home")}
      >
        <MyIcon
          name="calendar-number-outline"
          size={24}
          color={colors.primary}
        />
        <ThemedText style={[styles.itemText]}>Citas</ThemedText>
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

      <List.Section style={styles.listSection}>
        <List.Accordion
          title="Agricultura"
          titleStyle={styles.itemText}
          style={styles.accordion}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
          left={(props) => (
            <List.Icon
              {...props}
              icon={() => (
                <MyIcon name="leaf-outline" size={24} color={colors.primary} />
              )}
            />
          )}
        >
          <List.Item
            title="Producción Ganadero"
            titleStyle={styles.itemText}
            style={styles.drawerItem}
            onPress={() =>
              handleItemPress({
                name: "produccion-ganadero",
                params: { screen: "ProduccionPage" },
              })
            }
            left={() => (
              <MyIcon
                name="construct-outline"
                size={24}
                color={colors.primary}
              />
            )}
          />
          <List.Item
            title="Insumos Ganadero"
            titleStyle={styles.itemText}
            style={styles.drawerItem}
            onPress={() =>
              handleItemPress({
                name: "produccion-ganadero",
                params: { screen: "InsumosGanaderoPage" },
              })
            }
            left={() => (
              <MyIcon name="bag-add-outline" size={24} color={colors.primary} />
            )}
          />
          <List.Item
            title="Análisis y Eficiencia"
            titleStyle={styles.itemText}
            style={styles.drawerItem}
            onPress={() =>
              handleItemPress({
                name: "produccion-ganadero",
                params: { screen: "AnalisisGanaderoPage" },
              })
            }
            left={() => (
              <MyIcon
                name="stats-chart-outline"
                size={24}
                color={colors.primary}
              />
            )}
          />
        </List.Accordion>
      </List.Section>

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
    paddingLeft: 16,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 30,
  },
  logoutText: {
    color: "#ff4444",
  },
  listSection: {
    marginVertical: 0,
    paddingVertical: 0,
  },
  accordion: {
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
});
