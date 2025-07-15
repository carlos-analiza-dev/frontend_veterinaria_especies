import { User } from "@/core/users/interfaces/users-response.interface";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { ThemedText } from "../theme/components/ThemedText";
import { ThemedView } from "../theme/components/ThemedView";
import { useThemeColor } from "../theme/hooks/useThemeColor";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const imageUrl = user.profileImages[0]?.url?.replace(
    "localhost",
    process.env.EXPO_PUBLIC_API || "192.168.0.10"
  );

  const { colors } = useTheme();
  const secondary = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");
  const info = useThemeColor({}, "info");
  const warning = useThemeColor({}, "warning");

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      flexDirection: "row",
    },
    avatarContainer: {
      marginRight: 15,
      backgroundColor: colors.background,
    },
    infoContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 3,
      color: textColor,
    },
    email: {
      fontSize: 14,
      color: secondary,
      marginBottom: 8,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
      backgroundColor: colors.background,
    },
    detailText: {
      fontSize: 13,
      color: secondary,
      marginLeft: 5,
      flexShrink: 1,
    },
    statusContainer: {
      flexDirection: "row",
      marginTop: 8,
      flexWrap: "wrap",
      backgroundColor: colors.background,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginRight: 5,
      marginBottom: 5,
    },
    activeBadge: {
      backgroundColor: success + "20",
    },
    inactiveBadge: {
      backgroundColor: danger + "20",
    },
    authorizedBadge: {
      backgroundColor: info + "20",
    },
    unauthorizedBadge: {
      backgroundColor: warning + "20",
    },
    statusText: {
      fontSize: 12,
      color: textColor,
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <ThemedView style={styles.avatarContainer}>
        <Avatar.Image
          size={48}
          source={
            user && user.profileImages.length > 0
              ? { uri: imageUrl }
              : require("@/images/profile.png")
          }
        />
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.name}>{user.name}</ThemedText>
        <ThemedText style={styles.email}>{user.email}</ThemedText>

        <ThemedView style={styles.detailRow}>
          <FontAwesome name="user" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>{user.role.name}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailRow}>
          <FontAwesome name="phone" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>{user.telefono}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.detailRow}>
          <FontAwesome name="map-marker" size={14} color={secondary} />
          <ThemedText style={styles.detailText} numberOfLines={1}>
            {user.direccion}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.statusContainer}>
          <ThemedView
            style={[
              styles.statusBadge,
              user.isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <ThemedText style={styles.statusText}>
              {user.isActive ? "Activo" : "Inactivo"}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.statusBadge,
              user.isAuthorized
                ? styles.authorizedBadge
                : styles.unauthorizedBadge,
            ]}
          >
            <ThemedText style={styles.statusText}>
              {user.isAuthorized ? "Autorizado" : "No autorizado"}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default UserCard;
