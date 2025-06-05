import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import MyIcon from "@/presentation/auth/components/MyIcon";
import React, { useMemo } from "react";
import {
  Image,
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

  // Memoizar valores calculados
  const statusStyles = useMemo(
    () => ({
      backgroundColor: pais.isActive ? "#e6f7ee" : "#ffebee",
      color: pais.isActive ? "#4CAF50" : "#F44336",
    }),
    [pais.isActive]
  );

  const departamentosCount = useMemo(
    () => pais.departamentos?.length || 0,
    [pais.departamentos]
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, { marginTop: height * 0.02 }]}
      accessibilityLabel={`País ${pais.nombre}, ${
        pais.isActive ? "Activo" : "Inactivo"
      }`}
      accessibilityRole="button"
    >
      <View style={styles.flagContainer}>
        <Image
          source={{
            uri: `https://flagcdn.com/w80/${pais.code.toLowerCase()}.png`,
          }}
          style={styles.flagImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          onError={(e) =>
            console.log("Error loading flag:", e.nativeEvent.error)
          }
          defaultSource={require("@/images/bandera-notfound.png")}
        />
      </View>

      <View style={styles.header}>
        <Text
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={`Nombre del país: ${pais.nombre}`}
        >
          {pais.nombre}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusStyles.backgroundColor },
          ]}
          accessibilityLabel={`Estado: ${
            pais.isActive ? "Activo" : "Inactivo"
          }`}
        >
          <MyIcon
            name={pais.isActive ? "checkmark-circle" : "close-circle"}
            color={statusStyles.color}
            size={16}
          />
          <Text style={[styles.statusText, { color: statusStyles.color }]}>
            {pais.isActive ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.column}>
          <View style={styles.infoRow}>
            <MyIcon name="code" color="#666" size={18} />
            <Text
              style={styles.infoText}
              accessibilityLabel={`Código: ${pais.code}`}
            >
              Código: {pais.code}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MyIcon name="call" color="#666" size={18} />
            <Text
              style={styles.infoText}
              accessibilityLabel={`Prefijo telefónico: ${pais.code_phone}`}
            >
              Prefijo: {pais.code_phone}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MyIcon name="document-text" color="#666" size={18} />
            <Text
              style={styles.infoText}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityLabel={`Documento: ${pais.nombre_documento}`}
            >
              Documento: {pais.nombre_documento}
            </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.infoRow}>
            <MyIcon name="cash" color="#666" size={18} />
            <Text
              style={styles.infoText}
              accessibilityLabel={`Moneda: ${pais.nombre_moneda}`}
            >
              Moneda: {pais.nombre_moneda}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MyIcon name="pricetag" color="#666" size={18} />
            <Text
              style={styles.infoText}
              accessibilityLabel={`Símbolo monetario: ${pais.simbolo_moneda}`}
            >
              Símbolo: {pais.simbolo_moneda}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MyIcon name="business" color="#666" size={18} />
            <Text
              style={styles.infoText}
              accessibilityLabel={`Número de departamentos: ${departamentosCount}`}
            >
              Departamentos: {departamentosCount}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <MyIcon name="chevron-forward" color="#999" size={20} />
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(PaisesCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
    position: "relative",
    overflow: "hidden",
  },
  flagContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginLeft: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  column: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    flexShrink: 1,
  },
  arrowContainer: {
    position: "absolute",
    right: 12,
    top: "50%",
    marginTop: -10,
  },
  flagImage: {
    width: 40,
    height: 30,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
});
