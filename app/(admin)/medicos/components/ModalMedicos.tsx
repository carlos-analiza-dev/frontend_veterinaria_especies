import { diasSemana } from "@/helpers/funciones/diasDisponibles";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { TimePickerButton } from "@/presentation/theme/components/TimeInput";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";

interface Props {
  visible: boolean;
  hideModal: () => void;
  editingHorario: any;
  toggleDia: (dia: number) => void;
  diasSeleccionados: number[];
  setShowPicker: React.Dispatch<React.SetStateAction<"inicio" | "fin" | null>>;
  horaInicio: string;
  horaFin: string;
  setDisponible: React.Dispatch<React.SetStateAction<boolean>>;
  disponible: boolean;
  handleCrearHorario: () => Promise<void>;
  isLoading: boolean;
}

const ModalMedicos = ({
  editingHorario,
  hideModal,
  toggleDia,
  visible,
  diasSeleccionados,
  setShowPicker,
  horaInicio,
  horaFin,
  setDisponible,
  disponible,
  handleCrearHorario,
  isLoading,
}: Props) => {
  const secondary = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");
  const colors = { text: textColor };
  const primary = useThemeColor({}, "primary");
  const success = useThemeColor({}, "success");
  const background = useThemeColor({}, "background");

  const styles = StyleSheet.create({
    dayButton: {
      width: "30%",
      padding: 10,
      marginBottom: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: secondary + "40",
      alignItems: "center",
    },
    dayButtonSelected: {
      backgroundColor: primary + "20",
      borderColor: primary,
    },
    dayButtonText: {
      color: textColor,
    },
    timeSection: {
      marginBottom: 20,
    },
    timeSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: textColor,
      marginBottom: 12,
    },
    timeButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    timeButton: {
      width: "48%",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: secondary + "40",
      alignItems: "center",
    },
    timeButtonText: {
      color: textColor,
      fontSize: 15,
    },
    availabilityContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
      padding: 10,
      borderRadius: 8,
    },
    availabilityText: {
      marginLeft: 10,
      fontSize: 15,
      color: textColor,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    saveButton: {
      borderRadius: 8,
      paddingHorizontal: 24,
    },
    daysContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    modalContainer: {
      backgroundColor: background,
      margin: 20,
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: primary,
      marginBottom: 20,
      textAlign: "center",
    },
    timeInputsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
  });
  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={styles.modalTitle}>
            {editingHorario ? "Editar Horario" : "Nuevo Horario"}
          </ThemedText>

          <ThemedText style={{ color: textColor, marginBottom: 12 }}>
            Seleccione los días:
          </ThemedText>
          <View style={styles.daysContainer}>
            {diasSemana.map((dia) => (
              <TouchableOpacity
                key={dia.id}
                onPress={() => toggleDia(dia.id)}
                style={[
                  styles.dayButton,
                  diasSeleccionados.includes(dia.id) &&
                    styles.dayButtonSelected,
                ]}
              >
                <Text style={styles.dayButtonText}>{dia.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.timeSection}>
            <ThemedText style={styles.timeSectionTitle}>Horario</ThemedText>
            <View style={styles.timeInputsContainer}>
              <TimePickerButton
                label="Hora de inicio"
                time={horaInicio}
                onPress={() => setShowPicker("inicio")}
                colors={colors}
              />
              <TimePickerButton
                label="Hora de fin"
                time={horaFin}
                onPress={() => setShowPicker("fin")}
                colors={colors}
              />
            </View>
          </View>

          <View style={styles.availabilityContainer}>
            <TouchableOpacity onPress={() => setDisponible(!disponible)}>
              <FontAwesome
                name={disponible ? "check-square" : "square-o"}
                size={24}
                color={disponible ? success : textColor}
              />
            </TouchableOpacity>
            <Text style={styles.availabilityText}>Disponible</Text>
          </View>

          <View style={styles.modalButtons}>
            <Button
              mode="contained"
              buttonColor={primary}
              onPress={handleCrearHorario}
              style={styles.saveButton}
              loading={isLoading}
              disabled={isLoading}
            >
              {editingHorario ? "Editar Horario" : "Guardar Horario"}
            </Button>
          </View>
        </ThemedView>
      </Modal>
    </Portal>
  );
};

export default ModalMedicos;
