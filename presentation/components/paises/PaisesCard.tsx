import { PaisesResponse } from "@/core/paises/interfaces/paises.response.interface";
import MyIcon from "@/presentation/auth/components/MyIcon";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import React, { useMemo } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  pais: PaisesResponse;
  onPress: () => void;
}

const PaisesCard = ({ pais, onPress }: Props) => {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();

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
      style={[
        styles.card,
        { marginTop: height * 0.02, backgroundColor: colors.background },
      ]}
      accessibilityLabel={`País ${pais.nombre}, ${
        pais.isActive ? "Activo" : "Inactivo"
      }`}
      accessibilityRole="button"
    >
      <ThemedView
        style={[styles.flagContainer, { backgroundColor: colors.background }]}
      >
        <Image
          source={{
            uri: `https://flagcdn.com/w80/${pais.code.toLowerCase()}.png`,
          }}
          style={styles.flagImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          defaultSource={require("@/images/bandera-notfound.png")}
        />
      </ThemedView>

      <ThemedView
        style={[styles.header, { backgroundColor: colors.background }]}
      >
        <ThemedText
          style={styles.title}
          numberOfLines={1}
          ellipsizeMode="tail"
          accessibilityLabel={`Nombre del país: ${pais.nombre}`}
        >
          {pais.nombre}
        </ThemedText>
        <ThemedView
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
          <ThemedText
            style={[styles.statusText, { color: statusStyles.color }]}
          >
            {pais.isActive ? "Activo" : "Inactivo"}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView
        style={[styles.infoContainer, { backgroundColor: colors.background }]}
      >
        <ThemedView
          style={[styles.column, { backgroundColor: colors.background }]}
        >
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="code" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              accessibilityLabel={`Código: ${pais.code}`}
            >
              Código: {pais.code}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="call" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              accessibilityLabel={`Prefijo telefónico: ${pais.code_phone}`}
            >
              Prefijo: {pais.code_phone}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="document-text" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              numberOfLines={1}
              ellipsizeMode="tail"
              accessibilityLabel={`Documento: ${pais.nombre_documento}`}
            >
              Documento: {pais.nombre_documento}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          style={[styles.column, { backgroundColor: colors.background }]}
        >
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="cash" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              accessibilityLabel={`Moneda: ${pais.nombre_moneda}`}
            >
              Moneda: {pais.nombre_moneda}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="pricetag" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              accessibilityLabel={`Símbolo monetario: ${pais.simbolo_moneda}`}
            >
              Símbolo: {pais.simbolo_moneda}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={[styles.infoRow, { backgroundColor: colors.background }]}
          >
            <MyIcon name="business" color="#666" size={18} />
            <ThemedText
              style={styles.infoText}
              accessibilityLabel={`Número de departamentos: ${departamentosCount}`}
            >
              Departamentos: {departamentosCount}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.arrowContainer}>
        <MyIcon name="chevron-forward" color="#999" size={20} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default React.memo(PaisesCard);

const styles = StyleSheet.create({
  card: {
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
