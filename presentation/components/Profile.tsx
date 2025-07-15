import { User } from "@/core/auth/interfaces/user";
import { eliminarImagen } from "@/core/profile-images/core/delete-image";
import useGetAllImagesProfile from "@/hooks/perfil/useGetAllImagesProfile";
import useGetImagePerfil from "@/hooks/perfil/useGetImagePerfil";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar } from "react-native-paper";
import Toast from "react-native-toast-message";
import MyIcon from "../auth/components/MyIcon";
import { ThemedText } from "../theme/components/ThemedText";
import { ThemedView } from "../theme/components/ThemedView";
import ImageGallery from "./ImageGallery";

interface Props {
  user: User | undefined;
  primary: string;
  height: number;
  onUpdateProfileImage?: (uri: string) => Promise<void>;
}

const Profile = ({ user, height, primary, onUpdateProfileImage }: Props) => {
  const queryClient = useQueryClient();
  const userId = user?.id;
  const [galleryVisible, setGalleryVisible] = useState(false);
  const { data: imagenes_user } = useGetAllImagesProfile(userId ?? "");

  const { data: perfil } = useGetImagePerfil();
  const imageUrl = perfil?.data?.url
    ? perfil.data.url.replace(
        "localhost",
        process.env.EXPO_PUBLIC_API || "192.168.0.10"
      )
    : undefined;

  const [localImage, setLocalImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos requeridos",
        "Necesitamos acceso a tus fotos para cambiar la imagen de perfil"
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      setLocalImage(selectedImage);

      if (onUpdateProfileImage) {
        try {
          await onUpdateProfileImage(selectedImage);
          Toast.show({
            type: "success",
            text1: "Exito",
            text2: "Perfil actualizado exitosamente",
          });
          queryClient.invalidateQueries({ queryKey: ["perfil-users"] });
          queryClient.invalidateQueries({ queryKey: ["all-images-perfil"] });
        } catch (error) {
          Alert.alert("Error", "No se pudo actualizar la imagen de perfil");
          setLocalImage(null);
        }
      }
    }
  };

  const openGallery = () => {
    if (imagenes_user && imagenes_user.data.length > 0) {
      setGalleryVisible(true);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await eliminarImagen(imageId);
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Imagen eliminada",
      });
      queryClient.invalidateQueries({ queryKey: ["perfil-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-images-perfil"] });
    } catch (error) {
      if (isAxiosError(error)) {
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { height: height * 0.2 }]}>
        <ThemedView style={[styles.avatarWrapper, { bottom: -50 }]}>
          <TouchableOpacity onPress={openGallery}>
            <Avatar.Image
              size={100}
              source={
                imageUrl ? { uri: imageUrl } : require("@/images/profile.png")
              }
              style={styles.avatarImage}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage} style={styles.editIcon}>
            <MyIcon name="camera" size={20} color="white" />
          </TouchableOpacity>
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
      <ImageGallery
        visible={galleryVisible}
        images={imagenes_user?.data || []}
        onClose={() => setGalleryVisible(false)}
        onDelete={(imageId) => handleDeleteImage(imageId)}
      />
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
  editIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: 5,
  },
});
