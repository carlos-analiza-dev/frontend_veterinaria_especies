import { Image } from "expo-image";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewToken,
} from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

type ImageItem = {
  id?: string;
  url: string;
};

interface ImageGalleryProps {
  visible: boolean;
  images: ImageItem[];
  onClose: () => void;
  onDelete?: (imageId: string) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ImageGallery = ({
  visible,
  images,
  onClose,
  onDelete,
}: ImageGalleryProps) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleOnViewableItemsChanged = useRef(
    (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      if (info.viewableItems.length > 0) {
        const index = info.viewableItems[0].index;
        if (index !== null && index !== undefined) {
          setCurrentIndex(index);
        }
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item }: { item: { url: string; id?: string } }) => {
    return (
      <View style={[styles.imageContainer, { width: screenWidth * 0.95 }]}>
        <Image
          source={{
            uri: item.url.replace(
              "localhost",
              process.env.EXPO_PUBLIC_API || "192.168.0.10"
            ),
          }}
          style={styles.image}
          contentFit="contain"
        />

        {onDelete && item.id && (
          <IconButton
            icon="delete"
            size={24}
            style={styles.deleteButton}
            iconColor={theme.colors.error}
            onPress={() => onDelete(item.id || "")}
          />
        )}
      </View>
    );
  };

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                { backgroundColor: theme.colors.background },
              ]}
            >
              {!images || images.length === 0 ? (
                <Text>No hay imágenes para mostrar</Text>
              ) : (
                <>
                  <View style={styles.header}>
                    <Text variant="titleMedium" style={styles.counter}>
                      {currentIndex + 1} de {images.length}
                    </Text>

                    <IconButton
                      icon="close"
                      size={24}
                      onPress={onClose}
                      iconColor={theme.colors.onSurface}
                      style={styles.closeButton}
                    />
                  </View>

                  <Animated.FlatList
                    ref={flatListRef}
                    data={images}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    onViewableItemsChanged={handleOnViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={(_, index) => ({
                      length: screenWidth * 0.95,
                      offset: screenWidth * 0.95 * index,
                      index,
                    })}
                    initialScrollIndex={0}
                  />

                  <View style={styles.navigationButtons}>
                    <IconButton
                      icon="chevron-left"
                      size={30}
                      onPress={() =>
                        scrollToIndex(Math.max(0, currentIndex - 1))
                      }
                      disabled={currentIndex === 0}
                      iconColor={theme.colors.onSurface}
                      style={styles.navButton}
                    />

                    <IconButton
                      icon="chevron-right"
                      size={30}
                      onPress={() =>
                        scrollToIndex(
                          Math.min(images.length - 1, currentIndex + 1)
                        )
                      }
                      disabled={currentIndex === images.length - 1}
                      iconColor={theme.colors.onSurface}
                      style={styles.navButton}
                    />
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.85,
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  counter: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
  closeButton: {
    marginRight: 5,
  },
  imageContainer: {
    width: screenWidth * 0.95,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "85%",
  },
  deleteButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.7)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navigationButtons: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    transform: [{ translateY: -15 }],
  },
  navButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
  },
});

export default ImageGallery;
