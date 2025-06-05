import { User } from "@/core/users/interfaces/users-response.interface";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const avatarUrl =
    "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.avatarContainer}>
        <Avatar.Image size={48} source={{ uri: avatarUrl }} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.detailRow}>
          <FontAwesome name="user" size={14} color="#666" />
          <Text style={styles.detailText}>{user.rol}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="phone" size={14} color="#666" />
          <Text style={styles.detailText}>{user.telefono}</Text>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={14} color="#666" />
          <Text style={styles.detailText} numberOfLines={1}>
            {user.direccion}
          </Text>
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              user.isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {user.isActive ? "Activo" : "Inactivo"}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              user.isAuthorized
                ? styles.authorizedBadge
                : styles.unauthorizedBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {user.isAuthorized ? "Autorizado" : "No autorizado"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
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
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    flexShrink: 1,
  },
  statusContainer: {
    flexDirection: "row",
    marginTop: 8,
    flexWrap: "wrap",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  activeBadge: {
    backgroundColor: "#d4edda",
  },
  inactiveBadge: {
    backgroundColor: "#f8d7da",
  },
  authorizedBadge: {
    backgroundColor: "#d1ecf1",
  },
  unauthorizedBadge: {
    backgroundColor: "#fff3cd",
  },
  statusText: {
    fontSize: 12,
    color: "#333",
  },
});

export default UserCard;
