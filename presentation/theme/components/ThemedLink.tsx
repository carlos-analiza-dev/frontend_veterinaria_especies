import { Ionicons } from "@expo/vector-icons";
import { Link, LinkProps } from "expo-router";
import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

interface ThemedLinkProps extends LinkProps {
  children: React.ReactNode;
  style?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  href: LinkProps["href"]; // Hacemos href obligatorio
}

const ThemedLink: React.FC<ThemedLinkProps> = ({
  children,
  style,
  icon,
  iconPosition = "left",
  disabled = false,
  href,
  ...rest
}) => {
  const primaryColor = useThemeColor({}, "primary");

  const textColor = primaryColor;

  return (
    <Link
      href={href}
      {...rest}
      style={[styles.link, { color: textColor }, style]}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && (
        <Ionicons
          name={icon}
          size={16}
          color={textColor}
          style={styles.leftIcon}
        />
      )}

      <ThemedText style={{ color: textColor }}>{children}</ThemedText>

      {icon && iconPosition === "right" && (
        <Ionicons
          name={icon}
          size={16}
          color={textColor}
          style={styles.rightIcon}
        />
      )}
    </Link>
  );
};

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
    fontWeight: "500",
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
});

export default ThemedLink;
