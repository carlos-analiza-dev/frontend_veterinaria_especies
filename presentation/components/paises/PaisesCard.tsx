import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import MyIcon from "@/presentation/auth/components/MyIcon";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

interface Props {
  pais: PaisesResponse;
  onPress: () => void;
}

const PaisesCard = ({ pais, onPress }: Props) => {
  const { height } = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { marginTop: height * 0.02 }]}
    >
      <View style={styles.row}>
        <MyIcon name="globe-outline" color="#333" size={22} />
        <Text style={styles.text}>{pais.nombre}</Text>
      </View>
      <View style={styles.row}>
        <MyIcon name="code-outline" color="#333" size={22} />
        <Text style={styles.text}>{pais.code}</Text>
      </View>
      <View style={styles.row}>
        <MyIcon
          name={
            pais.isActive ? "checkmark-circle-outline" : "close-circle-outline"
          }
          color={pais.isActive ? "green" : "red"}
          size={22}
        />
        <Text style={[styles.text, { color: pais.isActive ? "green" : "red" }]}>
          {pais.isActive ? "Activo" : "Inactivo"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PaisesCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
});
