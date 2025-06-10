import { User } from "@/core/auth/interfaces/user";
import React from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import MyIcon from "../auth/components/MyIcon";
import { ThemedText } from "../theme/components/ThemedText";
import { ThemedView } from "../theme/components/ThemedView";

interface Props {
  user: User | undefined;
  primary: string;
  height: number;
}

const Profile = ({ user, height, primary }: Props) => {
  const avatarUrl =
    "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { height: height * 0.2 }]}>
        <ThemedView style={[styles.avatarWrapper, { bottom: -50 }]}>
          <Avatar.Image
            size={100}
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={[styles.contentContainer, { marginTop: 60 }]}>
        <ThemedView style={styles.userInfoHeader}>
          <ThemedView
            style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
          >
            <ThemedText style={{ fontWeight: "black", fontSize: 24 }}>
              {user?.name}
            </ThemedText>
            <ThemedView
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
            >
              <MyIcon
                color={primary}
                name="checkmark-done-circle-outline"
                size={25}
              />
            </ThemedView>
          </ThemedView>

          <ThemedText style={styles.username}>{user?.email}</ThemedText>
        </ThemedView>

        <ThemedText style={styles.bio}>{user?.role.description}</ThemedText>

        <ThemedView style={styles.detailsContainer}>
          <ThemedView style={styles.detailItem}>
            <MyIcon name="location-outline" size={20} color={primary} />
            <ThemedText style={styles.detailText}>
              {user?.municipio.nombre}, {user?.departamento.nombre},{" "}
              {user?.pais.nombre}.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem}>
            <MyIcon name="person-outline" size={20} color={primary} />
            <ThemedText style={styles.detailText}>{user?.role.name}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem}>
            <MyIcon name="call-outline" size={20} color={primary} />
            <ThemedText style={styles.detailText}>{user?.telefono}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem}>
            <MyIcon name="calendar-outline" size={20} color={primary} />
            <ThemedText style={styles.detailText}>
              Se unió en {new Date(user?.createdAt || "").toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "black",
    width: "100%",
    position: "relative",
  },
  avatarWrapper: {
    position: "absolute",
    alignSelf: "flex-start",
    marginLeft: 20,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarImage: {
    borderRadius: 50,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  userInfoHeader: {
    marginBottom: 16,
  },
  username: {
    color: "#657786",
    fontSize: 16,
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  detailsContainer: {
    marginBottom: 16,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 15,
    color: "#657786",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statLabel: {
    fontSize: 14,
    color: "#657786",
  },
});
