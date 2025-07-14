import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useThemeColor } from "../hooks/useThemeColor";

interface ThemedMultiPickerProps {
  icon?: keyof typeof Ionicons.glyphMap;
  items: Array<{ label: string; value: string }>;
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
  enabled?: boolean;
}

const ThemedMultiPicker = ({
  icon,
  items,
  selectedValues = [],
  onValuesChange,
  placeholder = "Seleccione una o más opciones",
  error,
  enabled = true,
}: ThemedMultiPickerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const placeholderColor = "#5c5c5c";

  const toggleItem = (value: string) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onValuesChange(newSelected);
  };

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => toggleItem(item.value)}
    >
      <Checkbox
        status={selectedValues.includes(item.value) ? "checked" : "unchecked"}
        onPress={() => toggleItem(item.value)}
        color={primaryColor}
      />
      <Text style={[styles.itemText, { color: textColor }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  const displayText =
    selectedValues.length > 0
      ? items
          .filter((item) => selectedValues.includes(item.value))
          .map((item) => item.label)
          .join(", ")
      : placeholder;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.border,
          borderColor: error ? errorColor : isActive ? primaryColor : "#ccc",
          opacity: enabled ? 1 : 0.6,
        }}
        onPress={() => enabled && setModalVisible(true)}
        disabled={!enabled}
        activeOpacity={0.7}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={error ? errorColor : isActive ? primaryColor : textColor}
            style={{ marginRight: 10 }}
          />
        )}

        <Text
          style={{
            flex: 1,
            color: selectedValues.length > 0 ? textColor : placeholderColor,
            paddingVertical: 12,
          }}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color={error ? errorColor : isActive ? primaryColor : textColor}
        />
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: useThemeColor({}, "background") },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                {placeholder}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={textColor} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={styles.list}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: placeholderColor }]}>
                  No hay opciones disponibles
                </Text>
              }
            />

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: primaryColor }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    borderRadius: 10,
    padding: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  list: {
    flexGrow: 0,
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
  },
  confirmButton: {
    borderRadius: 5,
    padding: 12,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ThemedMultiPicker;
