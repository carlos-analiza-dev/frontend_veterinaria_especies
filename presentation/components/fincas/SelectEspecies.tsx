import { ResponseEspecies } from "@/core/especies/interfaces/response-especies.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  especies: ResponseEspecies[] | undefined;
  especieId: string;
  setEspecieId: React.Dispatch<React.SetStateAction<string>>;
  handleEspeciePress: (id: string) => void;
}

const SelectEspecies = ({
  especieId,
  especies,
  handleEspeciePress,
  setEspecieId,
}: Props) => {
  const colorPrimary = useThemeColor({}, "primary");
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.pickerContainer,
        { borderColor: colorPrimary, backgroundColor: colors.background },
      ]}
    >
      <Picker
        selectedValue={especieId}
        onValueChange={(itemValue) =>
          itemValue === "" ? setEspecieId("") : handleEspeciePress(itemValue)
        }
        style={styles.picker}
        dropdownIconColor={colorPrimary}
        mode="dropdown"
      >
        <Picker.Item label="Todas Especies" value="" />
        {especies?.map((especie) => (
          <Picker.Item
            key={especie.id}
            label={especie.nombre}
            value={especie.id}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
  },
  picker: {
    height: 60,
    width: "100%",
    color: "black",
  },
});

export default SelectEspecies;
