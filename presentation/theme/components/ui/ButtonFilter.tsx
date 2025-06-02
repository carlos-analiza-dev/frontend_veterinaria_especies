import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { useThemeColor } from "../../hooks/useThemeColor";
import { ThemedText } from "../ThemedText";

interface ThemedButtonProps {
  title?: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "text";
}

const ButtonFilter: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  children,
  variant = "primary",
}) => {
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      paddingVertical: 5,
      paddingHorizontal: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: primaryColor,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: textColor,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: primaryColor,
        };
      case "text":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          padding: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 7,
      fontWeight: "500",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          color: backgroundColor,
        };
      case "secondary":
        return {
          ...baseStyle,
          color: primaryColor,
        };
      case "outline":
        return {
          ...baseStyle,
          color: primaryColor,
        };
      case "text":
        return {
          ...baseStyle,
          color: primaryColor,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? backgroundColor : primaryColor}
          size="small"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={20}
              color={getTextStyle().color}
              style={{ marginRight: title ? 8 : 0 }}
            />
          )}

          {title && (
            <ThemedText style={[getTextStyle(), textStyle]}>{title}</ThemedText>
          )}

          {children}

          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={20}
              color={getTextStyle().color}
              style={{ marginLeft: title ? 8 : 0 }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 32,
  },
});

export default ButtonFilter;
