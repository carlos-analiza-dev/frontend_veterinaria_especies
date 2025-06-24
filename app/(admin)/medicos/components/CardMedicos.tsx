import { Medico } from "@/core/medicos/interfaces/obtener-medicos.interface";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import HorariosMedicos from "./HorariosMedicos";

interface Props {
  medico: Medico;
  onPress: () => void;
}

const CardMedicos = ({ medico, onPress }: Props) => {
  const { colors } = useTheme();
  const secondary = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");
  const success = useThemeColor({}, "success");
  const danger = useThemeColor({}, "danger");
  const info = useThemeColor({}, "info");
  const warning = useThemeColor({}, "warning");
  const primary = useThemeColor({}, "primary");

  const avatarUrl =
    "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      marginBottom: 10,
    },
    avatarContainer: {
      marginRight: 15,
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 3,
      color: textColor,
    },
    email: {
      fontSize: 14,
      color: secondary,
      marginBottom: 5,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 5,
    },
    detailText: {
      fontSize: 14,
      color: textColor,
      marginLeft: 8,
      flexShrink: 1,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: primary,
      marginTop: 10,
      marginBottom: 5,
    },
    statusContainer: {
      flexDirection: "row",
      marginTop: 8,
      flexWrap: "wrap",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    activeBadge: {
      backgroundColor: success + "20",
    },
    inactiveBadge: {
      backgroundColor: danger + "20",
    },
    authorizedBadge: {
      backgroundColor: info + "20",
    },
    unauthorizedBadge: {
      backgroundColor: warning + "20",
    },
    statusText: {
      fontSize: 12,
      color: textColor,
    },
    areasContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 5,
    },
    areaBadge: {
      backgroundColor: info + "20",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      marginRight: 6,
      marginBottom: 6,
    },
    areaText: {
      fontSize: 12,
      color: textColor,
    },
  });

  return (
    <ThemedView>
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Image size={60} source={{ uri: avatarUrl }} />
          </View>

          <View style={styles.infoContainer}>
            <ThemedText style={styles.name}>{medico.usuario.name}</ThemedText>
            <ThemedText style={styles.email}>{medico.usuario.email}</ThemedText>

            <View style={styles.detailRow}>
              <FontAwesome name="id-card" size={14} color={secondary} />
              <ThemedText style={styles.detailText}>
                {medico.numero_colegiado}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="stethoscope" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>
            {medico.especialidad}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="graduation-cap" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>
            {medico.universidad_formacion}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="briefcase" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>
            Experiencia: {medico.anios_experiencia} años
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="phone" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>
            {medico.usuario.telefono}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={14} color={secondary} />
          <ThemedText style={styles.detailText}>
            {medico.usuario.direccion}
          </ThemedText>
        </View>

        <ThemedText style={styles.sectionTitle}>Áreas de trabajo</ThemedText>
        <View style={styles.areasContainer}>
          {medico.areas_trabajo.map((area) => (
            <View key={area.id} style={styles.areaBadge}>
              <ThemedText style={styles.areaText}>{area.nombre}</ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              medico.isActive ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            <ThemedText style={styles.statusText}>
              {medico.isActive ? "Activo" : "Inactivo"}
            </ThemedText>
          </View>

          <View
            style={[
              styles.statusBadge,
              medico.usuario.isAuthorized
                ? styles.authorizedBadge
                : styles.unauthorizedBadge,
            ]}
          >
            <ThemedText style={styles.statusText}>
              {medico.usuario.isAuthorized ? "Autorizado" : "No autorizado"}
            </ThemedText>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: info + "20" }]}>
            <ThemedText style={styles.statusText}>
              ID: {medico.usuario.identificacion}
            </ThemedText>
          </View>
        </View>
      </TouchableOpacity>
      <ThemedView style={styles.card}>
        <HorariosMedicos medico={medico} medicoId={medico.id} />
      </ThemedView>
    </ThemedView>
  );
};

export default CardMedicos;
