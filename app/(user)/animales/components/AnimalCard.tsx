import { Animal } from "@/core/animales/interfaces/response-animales.interface";
import { eliminarImagenAnimal } from "@/core/animales_profile/core/delete-image-animal";
import MyIcon from "@/presentation/auth/components/MyIcon";
import AnimalComplementos from "@/presentation/components/animales/AnimalComplementos";
import AnimalFincaByPropietarion from "@/presentation/components/animales/AnimalFincaByPropietarion";
import AnimalMedicamento from "@/presentation/components/animales/AnimalMedicamento";
import AnimalParentInfo from "@/presentation/components/animales/AnimalParentInfo";
import AnimalProductionInfo from "@/presentation/components/animales/AnimalProductionInfo";
import AnimalTipoAlimentacion from "@/presentation/components/animales/AnimalTipoAlimentacion";
import InfoAnimal from "@/presentation/components/animales/InfoAnimal";
import ReproductiveStatus from "@/presentation/components/animales/ReproductiveStatus";
import ImageGallery from "@/presentation/components/ImageGallery";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar, Card, Divider, useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";
const { height, width: screenWidth } = Dimensions.get("window");

const isSmallScreen = screenWidth < 375;

interface Props {
  animal: Animal;
  onPress: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const AnimalCard = ({ animal, onPress, onUpdateProfileImage }: Props) => {
  const { colors } = useTheme();

  const scaleValue = useRef(new Animated.Value(1)).current;
  const queryClient = useQueryClient();
  const imageUrl = animal.profileImages[0]?.url?.replace(
    "localhost",
    process.env.EXPO_PUBLIC_API || "192.168.0.10"
  );
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const pickImage = async (animalId: string) => {
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
          await onUpdateProfileImage(selectedImage, animalId);
          Toast.show({
            type: "success",
            text1: "Exito",
            text2: "Perfil de animal actualizado exitosamente",
          });
          queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
        } catch (error) {
          Alert.alert("Error", "No se pudo actualizar la imagen de perfil");
          setLocalImage(null);
        }
      }
    }
  };

  const openGallery = () => {
    if (animal.profileImages && animal.profileImages.length > 0) {
      setGalleryVisible(true);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await eliminarImagenAnimal(imageId);
      Toast.show({
        type: "success",
        text1: "Exito",
        text2: "Foto de perfil del animal eliminada",
      });
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      setGalleryVisible(false);
    } catch (error) {
      if (isAxiosError(error)) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.response?.data
            ? error.response.data.message
            : "Error al eliminiar la foto de perfil del animal",
        });
      }
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPress();
    });
  };

  return (
    <>
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        delayPressIn={0}
      >
        <Animated.View
          style={[
            styles.cardContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <Card style={[styles.card, { backgroundColor: colors.surface }]}>
            <Card.Title
              title={animal.identificador}
              subtitle={`${animal.especie.nombre} - ${
                animal.razas.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas.length > 1
                  ? "Encaste"
                  : "Sin raza"
              } - ${animal.sexo}`}
              left={() => (
                <TouchableOpacity onPress={openGallery}>
                  <Avatar.Image
                    size={isSmallScreen ? 40 : 48}
                    source={
                      animal && animal?.profileImages.length > 0
                        ? { uri: imageUrl }
                        : require("@/images/profile.png")
                    }
                  />
                </TouchableOpacity>
              )}
              right={() => (
                <TouchableOpacity
                  onPress={() => pickImage(animal.id)}
                  style={styles.editIcon}
                >
                  <MyIcon
                    name="camera"
                    size={isSmallScreen ? 18 : 20}
                    color="white"
                  />
                </TouchableOpacity>
              )}
              titleStyle={[styles.title, { color: colors.onSurface }]}
              subtitleStyle={[
                styles.subtitle,
                { color: colors.onSurfaceVariant },
              ]}
            />
            <Card.Content style={styles.content}>
              <InfoAnimal animal={animal} />

              {animal.tipo_alimentacion.length > 0 && (
                <AnimalTipoAlimentacion animal={animal} />
              )}
              {animal.complementos && animal.complementos.length > 0 && (
                <AnimalComplementos animal={animal} />
              )}
              {animal.medicamento && <AnimalMedicamento animal={animal} />}
              {animal.sexo === "Macho" && (
                <ReproductiveStatus sexo="Macho" valor={animal.castrado} />
              )}
              {animal.sexo === "Hembra" && (
                <ReproductiveStatus sexo="Hembra" valor={animal.esterelizado} />
              )}

              <AnimalParentInfo
                title="Datos del Padre"
                nombre={animal.nombre_padre ?? undefined}
                arete={animal.arete_padre ?? undefined}
                razas={animal.razas_padre}
              />

              <AnimalParentInfo
                title="Datos de la Madre"
                nombre={animal.nombre_madre ?? undefined}
                arete={animal.arete_madre ?? undefined}
                razas={animal.razas_madre}
                numeroParto={animal.numero_parto_madre}
              />

              <Divider
                style={[styles.divider, { backgroundColor: colors.outline }]}
              />

              <AnimalFincaByPropietarion
                fincaNombre={animal.finca.nombre_finca}
                fincaAbreviatura={animal.finca.abreviatura}
                propietarioNombre={animal.propietario.name}
                observaciones={animal.observaciones}
              />
              {animal.produccion ||
              animal.tipo_produccion ||
              animal.animal_muerte ? (
                <>
                  <Divider
                    style={[
                      styles.divider,
                      { backgroundColor: colors.outline },
                    ]}
                  />
                  <AnimalProductionInfo
                    produccion={animal.produccion}
                    tipoProduccion={animal.tipo_produccion}
                    animalMuerto={animal.animal_muerte}
                    razonMuerte={animal.razon_muerte}
                  />
                </>
              ) : null}
            </Card.Content>
          </Card>
        </Animated.View>
      </TouchableWithoutFeedback>
      <ImageGallery
        visible={galleryVisible}
        images={animal.profileImages || []}
        onClose={() => setGalleryVisible(false)}
        onDelete={handleDeleteImage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 12,
    marginHorizontal: isSmallScreen ? 4 : 8,
  },
  card: {
    elevation: 2,
    borderRadius: 12,
    overflow: "hidden",
  },
  title: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: isSmallScreen ? 12 : 14,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: isSmallScreen ? 10 : 16,
    paddingVertical: isSmallScreen ? 8 : 12,
  },
  divider: {
    height: 1,
    marginVertical: isSmallScreen ? 6 : 8,
  },
  editIcon: {
    position: "absolute",
    right: isSmallScreen ? 4 : 8,
    bottom: isSmallScreen ? 4 : 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: isSmallScreen ? 4 : 5,
  },
});

export default AnimalCard;
