import { uploadProfileImage } from "@/core/profile-images/core/uploadProfileImage";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import Profile from "@/presentation/components/Profile";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import React from "react";
import { ScrollView, useWindowDimensions } from "react-native";

const ProfileUser = () => {
  const { user } = useAuthStore();
  const primary = useThemeColor({}, "tint");

  const handleUpdateProfileImage = async (imageUri: string) => {
    if (!user) return;

    try {
      await uploadProfileImage(imageUri);
    } catch (error) {
      throw error;
    }
  };

  const { height } = useWindowDimensions();
  return (
    <ScrollView style={{ flex: 1 }}>
      <Profile
        user={user}
        primary={primary}
        height={height}
        onUpdateProfileImage={handleUpdateProfileImage}
      />
    </ScrollView>
  );
};

export default ProfileUser;
