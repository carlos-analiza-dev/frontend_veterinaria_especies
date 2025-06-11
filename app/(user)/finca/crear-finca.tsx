import { CreateFinca } from "@/core/fincas/accions/crear-finca";
import { CrearFinca } from "@/core/fincas/interfaces/crear-finca.interface";
import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import { useDepartamentosPorPais } from "@/hooks/useDepartamentosPorPais";
import useMunicipiosByDepto from "@/hooks/useMunicipiosByDepto";
import usePaisesActives from "@/hooks/usePaises";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import EspecieCantidadPicker from "@/presentation/theme/components/EspecieCantidadPicker";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Toast from "react-native-toast-message";

const CrearFincaPage = () => {
  const queryClient = useQueryClient();
  const { handleSubmit, watch, setValue } = useForm<CrearFinca>({
    defaultValues: {
      especies_maneja: [],
    },
  });

  const { colors } = useTheme();
  const { user } = useAuthStore();
  const selectedDeptoId = watch("departamentoId");
  const selectedPaisId = watch("pais_id");

  const { data: deptos } = useDepartamentosPorPais(
    selectedPaisId || user?.pais.id || ""
  );
  const { data: municipios } = useMunicipiosByDepto(selectedDeptoId);
  const { data: paises } = usePaisesActives();

  const departmentItems =
    deptos?.data.departamentos.map((depto) => ({
      label: depto.nombre,
      value: depto.id.toString(),
    })) || [];

  const municipiosItems =
    municipios?.data.municipios.map((mun) => ({
      label: mun.nombre,
      value: mun.id.toString(),
    })) || [];

  const paisesItems =
    paises?.data.map((pais) => ({
      label: pais.nombre,
      value: pais.id.toString(),
    })) || [];

  const explotacionItems = TipoExplotacion.map((exp) => ({
    label: exp.explotacion,
    value: exp.explotacion,
  }));

  const onSubmit = async (data: CrearFinca) => {
    try {
      if (!data.nombre_finca) {
        Toast.show({
          type: "error",
          text1: "El nombre de la finca es requerido",
        });
        return;
      }
      if (!data.cantidad_animales || isNaN(Number(data.cantidad_animales))) {
        Toast.show({
          type: "error",
          text1: "Cantidad de animales debe ser un número válido",
        });
        return;
      }
      if (!data.ubicacion) {
        Toast.show({ type: "error", text1: "La ubicación es requerida" });
        return;
      }
      if (!data.pais_id) {
        Toast.show({ type: "error", text1: "Debe seleccionar un país" });
        return;
      }
      if (!data.departamentoId) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar un departamento",
        });
        return;
      }
      if (!data.municipioId) {
        Toast.show({ type: "error", text1: "Debe seleccionar un municipio" });
        return;
      }
      if (!data.tipo_explotacion) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar un tipo de explotación",
        });
        return;
      }
      if (!data.especies_maneja || data.especies_maneja.length === 0) {
        Toast.show({
          type: "error",
          text1: "Debe seleccionar al menos una especie",
        });
        return;
      }

      const sumaEspecies = data.especies_maneja.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );
      if (sumaEspecies !== Number(data.cantidad_animales)) {
        Toast.show({
          type: "error",
          text1: "La suma de especies no coincide",
          text2: `La suma debe ser igual a ${data.cantidad_animales}`,
        });
        return;
      }

      const fincaData = {
        nombre_finca: data.nombre_finca,
        cantidad_animales: Number(data.cantidad_animales),
        ubicacion: data.ubicacion,
        abreviatura: data.abreviatura,
        departamentoId: data.departamentoId,
        municipioId: data.municipioId,
        tamaño_total: data.tamaño_total,
        area_ganaderia: data.area_ganaderia,
        tipo_explotacion: data.tipo_explotacion,
        especies_maneja: data.especies_maneja,
        propietario_id: user?.id || "",
        pais_id: data.pais_id || "",
      };

      const response = await CreateFinca(fincaData);
      queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });
      if (response.status === 201) {
        Toast.show({ type: "success", text1: "Finca creada correctamente" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "No se pudo crear la finca" });
    }
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ThemedView style={styles.row}>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="Nombre finca"
              icon="home-outline"
              value={watch("nombre_finca")}
              onChangeText={(text) => setValue("nombre_finca", text)}
            />
          </ThemedView>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="# Animales"
              icon="paw-outline"
              keyboardType="numeric"
              value={watch("cantidad_animales")?.toString() ?? ""}
              onChangeText={(text) =>
                setValue("cantidad_animales", Number(text))
              }
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.row}>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="Ubicación"
              icon="location-outline"
              value={watch("ubicacion")}
              onChangeText={(text) => setValue("ubicacion", text)}
            />
          </ThemedView>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="Abreviatura"
              icon="language-outline"
              value={watch("abreviatura")}
              onChangeText={(text) => setValue("abreviatura", text)}
            />
          </ThemedView>
        </ThemedView>

        <ThemedPicker
          items={paisesItems}
          icon="earth"
          placeholder="Selecciona un país"
          selectedValue={watch("pais_id")}
          onValueChange={(value) => setValue("pais_id", value)}
        />

        <ThemedPicker
          items={departmentItems}
          icon="map"
          placeholder="Departamento"
          selectedValue={selectedDeptoId}
          onValueChange={(value) => {
            setValue("departamentoId", value);
            setValue("municipioId", "");
          }}
        />

        {selectedDeptoId && (
          <ThemedPicker
            items={municipiosItems}
            icon="pin"
            placeholder="Municipio"
            selectedValue={watch("municipioId")}
            onValueChange={(value) => setValue("municipioId", value)}
          />
        )}

        <ThemedView style={styles.row}>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="Tamaño (ha)"
              icon="map-outline"
              value={watch("tamaño_total")}
              onChangeText={(text) => setValue("tamaño_total", text)}
            />
          </ThemedView>
          <ThemedView
            style={[styles.column, { backgroundColor: colors.background }]}
          >
            <ThemedTextInput
              placeholder="Área total (ha)"
              icon="layers-outline"
              value={watch("area_ganaderia")}
              onChangeText={(text) => setValue("area_ganaderia", text)}
            />
          </ThemedView>
        </ThemedView>

        <ThemedPicker
          items={explotacionItems}
          icon="settings-outline"
          placeholder="Tipo de explotación"
          selectedValue={watch("tipo_explotacion")}
          onValueChange={(value) => setValue("tipo_explotacion", value)}
        />

        <EspecieCantidadPicker
          value={watch("especies_maneja") || []}
          onChange={(val) => setValue("especies_maneja", val)}
          cantidadTotal={Number(watch("cantidad_animales")) || 0}
        />

        <ThemedView style={{ marginBottom: 10, marginTop: 16 }}>
          <ThemedButton
            title="Guardar Finca"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    paddingVertical: 8,
  },
});

export default CrearFincaPage;
