import { ActualizarAnimalMuerte } from "@/core/animales/accions/update-animal-status-muerte";
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
  View,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  Portal,
  Switch,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";
const { width, height } = Dimensions.get("window");

const breakpoints = {
  small: 375,
  medium: 414,
  large: 768,
  xlarge: 1024,
};

const scale = (size: number) => {
  const scaleFactor = width / breakpoints.small;
  const scaledSize = size * Math.min(scaleFactor, 1.5);
  return Math.round(scaledSize);
};

const isSmallDevice = width < breakpoints.small;
const isMediumDevice = width >= breakpoints.small && width < breakpoints.medium;
const isTablet = width >= breakpoints.large;

interface Props {
  animal: Animal;
  onPress: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const AnimalCard = ({ animal, onPress, onUpdateProfileImage }: Props) => {
  const { colors } = useTheme();
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
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
                    size={isSmallDevice ? 40 : 48}
                    source={
                      animal && animal?.profileImages.length > 0
                        ? { uri: imageUrl }
                        : require("@/images/profile.png")
                    }
                  />
                </TouchableOpacity>
              )}
              right={() => (
                <View style={styles.rightIconsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setDeathStatus(animal.animal_muerte);
                      setDeathReason(animal.razon_muerte);
                      setDeathDialogVisible(true);
                    }}
                    style={styles.iconButton}
                  >
                    <MyIcon
                      name={animal.animal_muerte ? "warning" : "heart"}
                      size={isSmallDevice ? 16 : 18}
                      color="white"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => pickImage(animal.id)}
                    style={styles.iconButton}
                  >
                    <MyIcon
                      name="camera"
                      size={isSmallDevice ? 16 : 18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
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
      <Portal>
        <Dialog
          visible={deathDialogVisible}
          onDismiss={() => setDeathDialogVisible(false)}
        >
          <Dialog.Title>
            {deathStatus ? "Marcar como fallecido" : "Marcar como vivo"}
          </Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <Text>¿El animal ha fallecido?</Text>
              <Switch
                value={deathStatus}
                onValueChange={(value) => {
                  setDeathStatus(value);
                  if (!value) setDeathReason("N/D");
                }}
              />
            </View>

            {deathStatus && (
              <TextInput
                label="Razón de la muerte"
                value={deathReason}
                onChangeText={setDeathReason}
                mode="outlined"
                style={{ marginTop: 8 }}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeathDialogVisible(false)}>
              Cancelar
            </Button>
            <Button
              onPress={async () => {
                try {
                  if (
                    deathStatus &&
                    (!deathReason ||
                      deathReason.trim() === "" ||
                      deathReason === "N/D")
                  ) {
                    Toast.show({
                      type: "error",
                      text1: "Error",
                      text2:
                        "Debe ingresar una razón de muerte válida (no puede estar vacía o ser 'N/D')",
                    });
                    return;
                  }
                  await ActualizarAnimalMuerte(animal.id, {
                    animal_muerte: deathStatus,
                    razon_muerte: deathReason,
                  });
                  Toast.show({
                    type: "success",
                    text1: "Estado actualizado",
                    text2: deathStatus
                      ? "Animal marcado como fallecido"
                      : "Animal marcado como vivo",
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["animales-propietario"],
                  });
                  setDeathDialogVisible(false);
                } catch (error) {
                  if (isAxiosError(error)) {
                    const messages = error.response?.data?.message;
                    const errorMessage = Array.isArray(messages)
                      ? messages[0]
                      : typeof messages === "string"
                      ? messages
                      : "Hubo un error al actualizar el estado";

                    Toast.show({
                      type: "error",
                      text1: errorMessage,
                    });
                  } else {
                    Toast.show({
                      type: "error",
                      text1: "Error inesperado",
                      text2: "Contacte al administrador",
                    });
                  }
                }
              }}
            >
              Guardar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: scale(12),
    marginHorizontal: isTablet ? scale(16) : scale(8),
  },
  card: {
    elevation: 2,
    borderRadius: scale(12),
    overflow: "hidden",
    maxWidth: isTablet ? 600 : "100%", // Limitar ancho en tablets
    alignSelf: isTablet ? "center" : "auto", // Centrar en tablets
  },
  title: {
    fontSize: isSmallDevice
      ? scale(14)
      : isMediumDevice
      ? scale(16)
      : scale(18),
    fontWeight: "bold",
    marginBottom: scale(2),
    maxWidth: width * 0.6, // Prevenir overflow
  },
  subtitle: {
    fontSize: isSmallDevice
      ? scale(11)
      : isMediumDevice
      ? scale(12)
      : scale(14),
    marginTop: scale(2),
    maxWidth: width * 0.6,
  },
  content: {
    paddingHorizontal: isSmallDevice
      ? scale(10)
      : isMediumDevice
      ? scale(14)
      : scale(16),
    paddingVertical: isSmallDevice
      ? scale(6)
      : isMediumDevice
      ? scale(10)
      : scale(12),
  },
  divider: {
    height: 1,
    marginVertical: isSmallDevice
      ? scale(4)
      : isMediumDevice
      ? scale(6)
      : scale(8),
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    width: isTablet ? scale(100) : scale(80),
    marginRight: isTablet ? scale(12) : scale(8),
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: scale(20),
    width: isTablet ? scale(36) : scale(32),
    height: isTablet ? scale(36) : scale(32),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: isTablet ? scale(12) : scale(8),
  },
});

export default AnimalCard;
