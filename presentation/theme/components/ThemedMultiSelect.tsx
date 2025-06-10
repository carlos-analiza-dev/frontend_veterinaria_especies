import { StyleSheet, Text, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";
import { ThemedView } from "./ThemedView";

interface ThemedMultiSelectProps {
  items: { label: string; value: string }[];
  selectedItems: string[];
  onSelectedItemsChange: (items: string[]) => void;
  placeholder?: string;
  icon?: string;
  error?: string;
}

export const ThemedMultiSelect = ({
  items,
  selectedItems,
  onSelectedItemsChange,
  placeholder,
  icon,
  error,
}: ThemedMultiSelectProps) => {
  const { colors } = useTheme();

  const toggleItem = (value: string) => {
    const newSelected = selectedItems.includes(value)
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
    onSelectedItemsChange(newSelected);
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {placeholder && (
        <Text style={[styles.placeholder, { color: colors.onSurfaceVariant }]}>
          {placeholder}
        </Text>
      )}

      <View style={styles.chipsContainer}>
        {items.map((item) => (
          <Chip
            key={item.value}
            selected={selectedItems.includes(item.value)}
            onPress={() => toggleItem(item.value)}
            style={styles.chip}
          >
            {item.label}
          </Chip>
        ))}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  placeholder: {
    marginBottom: 8,
    fontSize: 12,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
