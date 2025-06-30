import React from "react";
import { StyleSheet } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";
import { useThemeColor } from "../theme/hooks/useThemeColor";

interface Props {
  title: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
}

const Buscador = ({ title, searchTerm, setSearchTerm }: Props) => {
  const { colors } = useTheme();
  const textColor = useThemeColor({}, "text");
  return (
    <Searchbar
      style={[
        styles.searchInput,
        { backgroundColor: colors.background, color: textColor },
      ]}
      placeholder={title}
      onChangeText={setSearchTerm}
      value={searchTerm}
    />
  );
};

const styles = StyleSheet.create({
  searchInput: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default Buscador;
