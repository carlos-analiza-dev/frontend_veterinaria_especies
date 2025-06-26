import { CrearCitaInterface } from "@/core/citas/interfaces/crear-cita.interface";
import useGetAnimalesByFincaEspRaza from "@/hooks/animales/useGetAnimalesByFincaEspRaza";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetHorasMedicoByFecha from "@/hooks/horarios/useGetHorasMedicoByFecha";
import userGetMedicoByEspecialidadesByPais from "@/hooks/medicos/userGetMedicoByEspecialidadesByPais";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import useGetServiciosActivos from "@/hooks/servicios/useGetServiciosActivos";
import useGetSubServiciosByServicioId from "@/hooks/sub-servicios/useGetSubServiciosByServicioId";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "react-native-paper";

interface HoraDisponibleItem {
  value: string;
  label: string;
  horaInicio: string;
  horaFin: string;
  duracionDisponible: number;
  puedeAcomodarServicio?: boolean;
}

const CrearCita = () => {
  const { user } = useAuthStore();
  const userId = user?.id || "";
  const paisId = user?.pais.id || "";
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [especieId, setespecieId] = useState("");
  const [razaId, setRazaId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [filteredHours, setFilteredHours] = useState<HoraDisponibleItem[]>([]);
  const [duracion, setDuracion] = useState(1);

  const {
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearCitaInterface>();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      const localDate = new Date(selectedDate);
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, "0");
      const day = String(localDate.getDate()).padStart(2, "0");
      const formatted = `${year}-${month}-${day}`;
      setValue("fecha", formatted);
    }
  };

  const { data: especies } = useGetEspecies();
  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(userId);
  const fincaId = watch("fincaId");
  const { data: animales } = useGetAnimalesByFincaEspRaza(
    fincaId,
    especieId,
    razaId
  );

  const { data: categorias } = useGetServiciosActivos();
  const { data: servicios } = useGetSubServiciosByServicioId(categoriaId);
  const { data: medicos } = userGetMedicoByEspecialidadesByPais(
    paisId,
    categoriaId
  );
  const medicoId = watch("medicoId");
  const fecha = watch("fecha");

  const { data: horas_disponibles } = useGetHorasMedicoByFecha(
    medicoId,
    fecha,
    String(duracion)
  );

  const subServicioId = watch("subServicioId");

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (servicios && subServicioId && paisId && horas_disponibles) {
      const servicioSeleccionado = servicios.data.find(
        (s) => s.id === subServicioId
      );
      if (servicioSeleccionado) {
        const precioPais = servicioSeleccionado.preciosPorPais.find(
          (pp) => pp.pais.id === paisId
        );

        if (precioPais) {
          const duracionServicio = precioPais.tiempo;
          setValue("duracion", duracionServicio);
          setValue("totalPagar", precioPais.precio);
          setDuracion(duracionServicio);

          const horasFiltradas = horas_disponibles
            .map((hora) => {
              const inicio = timeToMinutes(hora.horaInicio);
              const fin = timeToMinutes(hora.horaFin);
              return {
                ...hora,
                duracionDisponible: fin - inicio,
                puedeAcomodarServicio: fin - inicio >= duracionServicio,
              };
            })
            .filter((hora) => hora.puedeAcomodarServicio);

          setFilteredHours(
            horasFiltradas.map((hora) => ({
              value: hora.horaInicio,
              label: `${hora.horaInicio} - ${hora.horaFin} (${Math.floor(
                duracionServicio / 60
              )}h ${duracionServicio % 60}m)`,

              horaInicio: hora.horaInicio,
              horaFin: hora.horaFin,
              duracionDisponible: hora.duracionDisponible,
            }))
          );
        }
      }
    }
  }, [subServicioId, horas_disponibles, servicios, paisId]);

  const handleHoraChange = (horaInicioSeleccionada: string) => {
    const duracionServicio = watch("duracion") || 0;

    const horaSeleccionada = filteredHours.find(
      (h) => h.horaInicio === horaInicioSeleccionada
    );

    if (horaSeleccionada) {
      const inicioMinutos = timeToMinutes(horaSeleccionada.horaInicio);
      const finMinutos = inicioMinutos + duracionServicio;

      const rangoCompletoDisponible = filteredHours.some((hora) => {
        const horaFinDisponible = timeToMinutes(hora.horaFin);
        return (
          timeToMinutes(hora.horaInicio) <= inicioMinutos &&
          horaFinDisponible >= finMinutos
        );
      });

      if (rangoCompletoDisponible) {
        const horasFin = Math.floor(finMinutos / 60);
        const minutosFin = finMinutos % 60;
        const horaFinFormateada = `${horasFin
          .toString()
          .padStart(2, "0")}:${minutosFin.toString().padStart(2, "0")}`;

        setValue("horaInicio", horaSeleccionada.horaInicio);
        setValue("horaFin", horaFinFormateada);
      } else {
        alert("El rango completo no está disponible para esta hora de inicio");
      }
    }
  };

  const allFincas =
    fincas?.data.fincas.map((finca) => ({
      value: finca.id,
      label: finca.nombre_finca,
    })) || [];

  const allEspecies =
    especies?.data.map((especie) => ({
      value: especie.id,
      label: especie.nombre,
    })) || [];

  const allRazas =
    razas?.data.map((raza) => ({
      value: raza.id,
      label: raza.nombre,
    })) || [];

  const allAnimales =
    animales?.map((animal) => ({
      value: animal.id,
      label: animal.identificador,
    })) || [];

  const allCategorias =
    categorias?.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })) || [];

  const allServicios =
    servicios?.data.map((servicio) => ({
      value: servicio.id,
      label: servicio.nombre,
    })) || [];

  const allMedicos =
    medicos?.map((medico) => ({
      value: medico.id,
      label: medico.usuario.name,
    })) || [];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Nueva Cita Veterinaria</ThemedText>
        </ThemedView>

        <ThemedView style={styles.formContainer}>
          <ThemedText style={styles.sectionTitle}>
            Información General
          </ThemedText>

          <ThemedText style={styles.sectionTitle}>Fecha</ThemedText>
          <ThemedView style={styles.dateInputContainer}>
            <ThemedButton
              icon="calendar"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateIcon}
            />
          </ThemedView>
          <ThemedTextInput
            placeholder="Selecciona una fecha"
            icon="calendar-outline"
            value={watch("fecha")}
            onFocus={() => setShowDatePicker(true)}
            showSoftInputOnFocus={false}
            error={errors.fecha?.message}
            style={[styles.input, styles.dateInput]}
          />

          {showDatePicker && (
            <DateTimePicker
              value={
                watch("fecha")
                  ? new Date(
                      Number(watch("fecha").split("-")[0]),
                      Number(watch("fecha").split("-")[1]) - 1,
                      Number(watch("fecha").split("-")[2])
                    )
                  : new Date()
              }
              mode="date"
              display="spinner"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <ThemedText style={styles.sectionTitle}>Finca</ThemedText>
          <ThemedPicker
            items={allFincas}
            icon="map-outline"
            placeholder="Selecciona una finca"
            selectedValue={watch("fincaId")}
            onValueChange={(text) => setValue("fincaId", text)}
          />

          <ThemedText style={styles.sectionTitle}>Datos del Animal</ThemedText>
          <ThemedPicker
            items={allEspecies}
            icon="paw-outline"
            placeholder="Especie del animal"
            selectedValue={especieId}
            onValueChange={(text) => setespecieId(text)}
          />
          <ThemedPicker
            items={allRazas}
            icon="paw-outline"
            placeholder="Raza del animal"
            selectedValue={razaId}
            onValueChange={(text) => setRazaId(text)}
          />
          <ThemedPicker
            items={allAnimales}
            icon="code-outline"
            placeholder="Identificador del animal"
            selectedValue={watch("animalId")}
            onValueChange={(text) => setValue("animalId", text)}
          />

          <ThemedText style={styles.sectionTitle}>
            Servicio Veterinario
          </ThemedText>
          <ThemedPicker
            items={allCategorias}
            icon="medkit-outline"
            placeholder="Tipo de servicio"
            selectedValue={categoriaId}
            onValueChange={(text) => setCategoriaId(text)}
          />
          <ThemedPicker
            items={allServicios}
            icon="list-outline"
            placeholder="Servicio específico"
            selectedValue={watch("subServicioId")}
            onValueChange={(text) => setValue("subServicioId", text)}
          />
          <ThemedPicker
            items={allMedicos}
            icon="person-outline"
            placeholder="Veterinario"
            selectedValue={watch("medicoId")}
            onValueChange={(text) => setValue("medicoId", text)}
          />

          {filteredHours.length > 0 ? (
            <>
              <ThemedText style={styles.sectionTitle}>
                Horarios Disponibles
              </ThemedText>
              <ThemedPicker
                items={filteredHours.map((hora) => ({
                  ...hora,
                  label: `${hora.horaInicio} - ${hora.horaFin} `,
                }))}
                icon="time-outline"
                placeholder="Selecciona un horario"
                selectedValue={watch("horaInicio")}
                onValueChange={handleHoraChange}
              />
            </>
          ) : (
            <ThemedView style={styles.warningContainer}>
              <ThemedText style={styles.warningText}>
                {watch("subServicioId") && watch("medicoId") && watch("fecha")
                  ? "No hay horarios disponibles para la duración de este servicio"
                  : "Complete la información del servicio para ver horarios disponibles"}
              </ThemedText>
            </ThemedView>
          )}

          <ThemedText style={styles.sectionTitle}>
            Detalles del Servicio
          </ThemedText>
          <ThemedTextInput
            placeholder="Duración estimada (horas)"
            icon="hourglass-outline"
            value={
              watch("duracion")?.toString()
                ? `${watch("duracion")} horas (duracion)`
                : ""
            }
            onChangeText={(text) => setValue("duracion", Number(text))}
            editable={false}
            style={styles.input}
          />
          <ThemedTextInput
            placeholder="Costo total"
            icon="cash-outline"
            value={watch("totalPagar") ? `${watch("totalPagar")}` : ""}
            onChangeText={(text) => setValue("totalPagar", Number(text))}
            editable={false}
            style={styles.input}
          />

          <ThemedView style={styles.buttonContainer}>
            <ThemedButton
              onPress={() => {}}
              icon="checkmark-circle-outline"
              title="Confirmar Cita"
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: "bold",
    color: "#333",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#555",
    marginTop: 8,
  },
  warningContainer: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA000",
  },
  warningText: {
    color: "#E65100",
    textAlign: "center",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
  },
  dateIcon: {
    marginLeft: 10,
  },
  confirmationContainer: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#E8F5E9",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  confirmationText: {
    color: "#2E7D32",
    textAlign: "center",
    fontSize: 14,
  },
});

export default CrearCita;
