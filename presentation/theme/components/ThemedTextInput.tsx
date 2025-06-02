import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface Props extends TextInputProps {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

const ThemedTextInput = ({ icon, error, ...rest }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const InputRef = useRef<TextInput>(null);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.border,
          borderColor: error ? errorColor : isActive ? primaryColor : "#ccc",
        }}
        onTouchStart={() => InputRef?.current?.focus()}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={error ? errorColor : isActive ? primaryColor : textColor}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          ref={InputRef}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          placeholderTextColor="#5c5c5c"
          {...rest}
          style={{
            flex: 1,
            color: textColor,
            marginRight: 10,
          }}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  border: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default ThemedTextInput;
