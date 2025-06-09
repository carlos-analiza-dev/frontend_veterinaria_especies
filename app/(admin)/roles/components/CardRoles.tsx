import { ResponseRoles } from "@/core/roles/interfaces/response-roles.interface";
import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, IconButton, useTheme } from "react-native-paper";

interface Props {
  rol: ResponseRoles;
  onPress: () => void;
  handleEditRol: (rolId: string) => void;
}

const CardRoles = ({ onPress, rol, handleEditRol }: Props) => {
  const theme = useTheme();
  const statusColor = rol.isActive ? "#4CAF50" : "#F44336";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.leftContent}>
            <View style={styles.iconContainer}>
              <MyIcon
                name="shield-half-outline"
                color={theme.colors.primary}
                size={28}
              />
            </View>

            <View style={styles.textContainer}>
              <ThemedText
                type="subtitle"
                style={styles.roleName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {rol.name}
              </ThemedText>

              <ThemedText
                style={styles.roleDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {rol.description || "Sin descripción"}
              </ThemedText>
            </View>
          </View>

          <View style={styles.rightContent}>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
            >
              <ThemedText style={styles.statusText}>
                {rol.isActive ? "Activo" : "Inactivo"}
              </ThemedText>
            </View>

            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEditRol(rol.id)}
              iconColor={theme.colors.primary}
              style={styles.editButton}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(63, 81, 181, 0.1)",
  },
  textContainer: {
    flex: 1,
  },
  roleName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  roleDescription: {
    color: "#666",
    fontSize: 13,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  editButton: {
    margin: 0,
  },
});

export default CardRoles;
