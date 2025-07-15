import { ResponseFincasByPropietario } from "@/core/fincas/interfaces/response-fincasByPropietario.interface";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  fincas: ResponseFincasByPropietario | undefined;
  fincaId: string;
  setFincaId: React.Dispatch<React.SetStateAction<string>>;
  handleFincaPress: (id: string) => void;
}

const SelectFincas = ({
  fincaId,
  fincas,
  handleFincaPress,
  setFincaId,
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
        selectedValue={fincaId}
        onValueChange={(itemValue) =>
          itemValue === "" ? setFincaId("") : handleFincaPress(itemValue)
        }
        style={styles.picker}
        dropdownIconColor={colorPrimary}
        mode="dropdown"
      >
        <Picker.Item label="Todas Fincas" value="" />
        {fincas?.fincas.map((finca) => (
          <Picker.Item
            key={finca.id}
            label={finca.nombre_finca}
            value={finca.id}
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

export default SelectFincas;
