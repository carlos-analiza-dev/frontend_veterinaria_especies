import { useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import MyIcon from "../auth/components/MyIcon";
import { useColorScheme } from "../theme/hooks/useColorScheme.web";

const GoBack = () => {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "white" : "black";
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ marginRight: 5, marginLeft: 5 }}
      onPress={() => navigation.goBack()}
    >
      <MyIcon name="arrow-back-outline" color={iconColor} size={20} />
    </TouchableOpacity>
  );
};

export default GoBack;
