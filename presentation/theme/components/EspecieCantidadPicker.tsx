import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  value: { especie: string; cantidad: number }[];
  onChange: (value: { especie: string; cantidad: number }[]) => void;
  cantidadTotal: number;
}

const EspecieCantidadPicker = ({ value, onChange, cantidadTotal }: Props) => {
  const { data: especies } = useGetEspecies();

  const calcularSumaActual = () => {
    return value.reduce((sum, item) => sum + (item.cantidad || 0), 0);
  };

  const getEspeciesSeleccionadas = (currentIndex: number) => {
    return value
      .filter((_, index) => index !== currentIndex)
      .map((item) => item.especie)
      .filter((especie) => especie !== "");
  };

  const handleEspecieChange = (index: number, especie: string) => {
    const especiesSeleccionadas = getEspeciesSeleccionadas(index);

    if (especiesSeleccionadas.includes(especie)) {
      Toast.show({
        type: "error",
        text1: "Especie ya seleccionada",
        text2: "Por favor elija una especie diferente",
      });
      return;
    }

    const newValues = [...value];
    newValues[index].especie = especie;
    onChange(newValues);
  };

  const handleCantidadChange = (index: number, cantidad: string) => {
    const newValues = [...value];
    const nuevaCantidad = Number(cantidad) || 0;
    const sumaActual = calcularSumaActual();
    const cantidadActualItem = newValues[index].cantidad || 0;

    const nuevaSuma = sumaActual - cantidadActualItem + nuevaCantidad;

    if (nuevaSuma > cantidadTotal) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `La suma de animales excede la cantidad antes descrita de animales en la finca.`,
      });
      return;
    }

    newValues[index].cantidad = nuevaCantidad;
    onChange(newValues);
  };

  const handleAdd = () => {
    const especiesDisponibles = especies?.data || [];

    if (value.length >= especiesDisponibles.length) {
      Toast.show({
        type: "error",
        text1: "No puedes añadir más especies",
        text2: "Ya has seleccionado todas las especies disponibles",
      });
      return;
    }

    if (calcularSumaActual() >= cantidadTotal) {
      Toast.show({
        type: "error",
        text1: "No puedes añadir más especies",
        text2: "La suma ya alcanza el total de animales",
      });
      return;
    }

    onChange([...value, { especie: "", cantidad: 0 }]);
  };

  const handleRemove = (index: number) => {
    const newValues = value.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const getOpcionesDisponibles = (currentIndex: number) => {
    const especiesSeleccionadas = getEspeciesSeleccionadas(currentIndex);
    return (especies?.data || []).filter(
      (opt) =>
        !especiesSeleccionadas.includes(opt.nombre) ||
        value[currentIndex]?.especie === opt.nombre
    );
  };

  return (
    <View>
      {value.map((item, index) => (
        <View key={index} style={styles.row}>
          <Picker
            selectedValue={item.especie}
            onValueChange={(val) => handleEspecieChange(index, val)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione especie" value="" />
            {getOpcionesDisponibles(index)?.map((opt) => (
              <Picker.Item key={opt.id} label={opt.nombre} value={opt.nombre} />
            )) || []}
          </Picker>
          <TextInput
            style={styles.input}
            placeholder="Cantidad"
            keyboardType="numeric"
            value={item.cantidad.toString()}
            onChangeText={(val) => handleCantidadChange(index, val)}
          />
          <Text style={styles.remove} onPress={() => handleRemove(index)}>
            ❌
          </Text>
        </View>
      ))}
      <Text style={styles.add} onPress={handleAdd}>
        ➕ Añadir especie
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  picker: {
    flex: 1,
  },
  input: {
    width: 80,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
  },
  remove: {
    fontSize: 20,
    color: "red",
  },
  add: {
    marginTop: 10,
    fontSize: 16,
    color: "blue",
  },
});

export default EspecieCantidadPicker;
