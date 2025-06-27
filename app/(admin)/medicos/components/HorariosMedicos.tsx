import { CrearHorario } from "@/core/horarios/accions/creae-horario-medico";
import { UpdateHorario } from "@/core/horarios/accions/editar-horario-medico";
import { CrearHoarioInterface } from "@/core/horarios/interface/crear-horario.interface";
import { Medico } from "@/core/medicos/interfaces/obtener-medicos.interface";
import { formatTime } from "@/helpers/funciones/formatoTiempo";
import { getDayName } from "@/helpers/funciones/obtenerDias";

import useGetHorariosByMedico from "@/hooks/horarios/useGetHorariosByMedico";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useThemeColor } from "@/presentation/theme/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Toast from "react-native-toast-message";
import ModalMedicos from "./ModalMedicos";

interface Props {
  medico: Medico;
  medicoId: string;
  onHorarioCreado?: () => void;
}

const HorariosMedicos = ({ medico, medicoId, onHorarioCreado }: Props) => {
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(false);
  const [editingHorario, setEditingHorario] = useState<any>(null);
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFin, setHoraFin] = useState("17:00");
  const [disponible, setDisponible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState<"inicio" | "fin" | null>(null);
  const secondary = useThemeColor({}, "textSecondary");
  const textColor = useThemeColor({}, "text");
  const danger = useThemeColor({}, "danger");
  const primary = useThemeColor({}, "primary");
  const success = useThemeColor({}, "success");
  const [horarioId, setHorarioId] = useState("");

  const { data: horarios, refetch } = useGetHorariosByMedico(medicoId);

  const showModal = (horario?: Omit<CrearHoarioInterface, "medicoId">) => {
    if (horario) {
      setEditingHorario(horario);
      setDiasSeleccionados([horario.diaSemana]);
      setHoraInicio(formatTime(horario.horaInicio));
      setHoraFin(formatTime(horario.horaFin));
      setDisponible(horario.disponible);
    } else {
      setEditingHorario(null);
      setDiasSeleccionados([]);
      setHoraInicio("08:00");
      setHoraFin("17:00");
      setDisponible(true);
    }
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setShowPicker(null);
  };

  const toggleDia = (dia: number) => {
    if (diasSeleccionados.includes(dia)) {
      setDiasSeleccionados(diasSeleccionados.filter((d) => d !== dia));
    } else {
      setDiasSeleccionados([...diasSeleccionados, dia]);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const timeString = `${hours}:${minutes}`;

      if (showPicker === "inicio") {
        setHoraInicio(timeString);
      } else if (showPicker === "fin") {
        setHoraFin(timeString);
      }
    }
    setShowPicker(null);
  };

  const handleCrearHorario = async () => {
    if (diasSeleccionados.length === 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Seleccione al menos un día",
      });
      return;
    }

    if (!horaInicio || !horaFin) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ingrese horas válidas",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingHorario) {
        const data = {
          medicoId,
          diaSemana: diasSeleccionados[0],
          horaInicio,
          horaFin,
          disponible,
        };

        await UpdateHorario(horarioId, data);

        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Horario actualizado correctamente",
        });
      } else {
        for (const dia of diasSeleccionados) {
          const data = {
            medicoId,
            diaSemana: dia,
            horaInicio,
            horaFin,
            disponible,
          };

          await CrearHorario(data);
        }

        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Horario(s) creado(s) correctamente",
        });
      }

      refetch();
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
      onHorarioCreado?.();
      hideModal();
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
          ? messages
          : "Hubo un error al procesar el horario";

        Toast.show({
          type: "error",
          text1: "Error",
          text2: errorMessage,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error inesperado",
          text2: "Contacte al administrador",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    title: {
      fontSize: 11,
      fontWeight: "bold",
      color: primary,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: primary,
      borderRadius: 20,
    },
    addButtonText: {
      color: "white",
      marginLeft: 6,
      fontSize: 14,
    },
    scheduleList: {
      marginTop: 8,
      borderRadius: 12,
      overflow: "hidden",
    },
    scheduleItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: secondary + "20",
    },
    scheduleItemLast: {
      borderBottomWidth: 0,
    },
    dayContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },
    dayText: {
      fontSize: 15,
      color: textColor,
      width: 100,
    },
    timeText: {
      fontSize: 14,
      color: secondary,
      marginRight: 16,
    },
    statusIcon: {
      marginRight: 16,
    },
    editButton: {
      padding: 6,
    },
    emptyText: {
      textAlign: "center",
      paddingVertical: 20,
      color: danger,
      fontStyle: "italic",
    },
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>
          Horario - {medico.usuario.name}
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => showModal()}>
          <FontAwesome name="plus" size={14} color="white" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {horarios && horarios.length > 0 ? (
        <ThemedView style={styles.scheduleList}>
          {horarios.map((horario, index) => (
            <ThemedView
              key={horario.id}
              style={[
                styles.scheduleItem,
                index === horarios.length - 1 && styles.scheduleItemLast,
              ]}
            >
              <View style={styles.dayContainer}>
                <ThemedText style={styles.dayText}>
                  {getDayName(horario.diaSemana)}
                </ThemedText>
                <ThemedText style={styles.timeText}>
                  {formatTime(horario.horaInicio)} -{" "}
                  {formatTime(horario.horaFin)}
                </ThemedText>
                <FontAwesome
                  name={horario.disponible ? "check-circle" : "times-circle"}
                  size={18}
                  color={horario.disponible ? success : danger}
                  style={styles.statusIcon}
                />
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  showModal(horario);
                  setHorarioId(horario.id);
                }}
              >
                <FontAwesome name="edit" size={18} color={primary} />
              </TouchableOpacity>
            </ThemedView>
          ))}
        </ThemedView>
      ) : (
        <ThemedText style={styles.emptyText}>
          No se ha definido horario de trabajo
        </ThemedText>
      )}
      <ModalMedicos
        visible={visible}
        hideModal={hideModal}
        editingHorario={editingHorario}
        toggleDia={toggleDia}
        diasSeleccionados={diasSeleccionados}
        setShowPicker={setShowPicker}
        horaInicio={horaInicio}
        horaFin={horaFin}
        setDisponible={setDisponible}
        disponible={disponible}
        handleCrearHorario={handleCrearHorario}
        isLoading={isLoading}
      />
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </ThemedView>
  );
};

export default HorariosMedicos;
