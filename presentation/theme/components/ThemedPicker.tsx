import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

interface ThemedPickerProps {
  icon?: keyof typeof Ionicons.glyphMap;
  items: Array<{ label: string; value: string }>;
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  enabled?: boolean;
}

const ThemedPicker = ({
  icon,
  items,
  selectedValue,
  onValueChange,
  placeholder = "Seleccione una opción",
  error,
  enabled = true,
}: ThemedPickerProps) => {
  const [isActive, setIsActive] = useState(false);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const placeholderColor = "#5c5c5c";

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.border,
          borderColor: error ? errorColor : isActive ? primaryColor : "#ccc",
          opacity: enabled ? 1 : 0.6,
        }}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={error ? errorColor : isActive ? primaryColor : textColor}
            style={{ marginRight: 10 }}
          />
        )}

        <Picker
          selectedValue={selectedValue}
          onValueChange={enabled ? onValueChange : undefined}
          onFocus={() => enabled && setIsActive(true)}
          onBlur={() => setIsActive(false)}
          style={{
            flex: 1,
            color: selectedValue ? textColor : placeholderColor,
          }}
          dropdownIconColor={textColor}
          enabled={enabled}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
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
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default ThemedPicker;
