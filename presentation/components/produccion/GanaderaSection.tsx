import {
  CreateProduccionFinca,
  TipoProduccionGanadera,
} from "@/core/produccion/interface/crear-produccion-finca.interface";
import { calidadHuevosData } from "@/helpers/data/calidadHuevos";
import {
  tiposProduccion,
  unidadLeche,
} from "@/helpers/data/dataProduccionFinca";
import ThemedButton from "@/presentation/theme/components/ThemedButton";
import ThemedCheckbox from "@/presentation/theme/components/ThemedCheckbox";
import ThemedPicker from "@/presentation/theme/components/ThemedPicker";
import ThemedTextInput from "@/presentation/theme/components/ThemedTextInput";
import React from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Divider, useTheme } from "react-native-paper";

interface Props {
  control: Control<CreateProduccionFinca>;
  watch: UseFormWatch<CreateProduccionFinca>;
  showDatePickerModal: (field: string) => void;
}

const GanaderaSection: React.FC<Props> = ({
  control,
  watch,
  showDatePickerModal,
}) => {
  const itemsHuevos =
    calidadHuevosData.map((calidad) => ({
      label: calidad.label,
      value: calidad.value,
    })) || [];
  const { colors } = useTheme();
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;
  const isMediumScreen = windowWidth >= 375 && windowWidth < 414;

  const dynamicStyles = {
    sectionTitle: {
      fontSize: isSmallScreen ? 18 : isMediumScreen ? 19 : 20,
      marginVertical: isSmallScreen ? 12 : 16,
    },
    label: {
      fontSize: isSmallScreen ? 14 : 16,
    },
    subSectionTitle: {
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : 18,
      marginBottom: isSmallScreen ? 8 : 12,
    },
    inputMargin: isSmallScreen ? 6 : 8,
    divider: {
      marginVertical: isSmallScreen ? 8 : 12,
      height: isSmallScreen ? 1 : 3,
    },
    checkboxContainer: {
      marginVertical: isSmallScreen ? 4 : 8,
    },
    subSection: {
      padding: isSmallScreen ? 4 : 5,
      marginBottom: isSmallScreen ? 3 : 5,
    },
  };
  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingHorizontal: isSmallScreen ? 8 : 12,
      }}
    >
      <Text style={styles.sectionTitle}>Producción Ganadera</Text>

      <View style={[styles.checkboxGroup, dynamicStyles.checkboxContainer]}>
        <Text
          style={[styles.label, { fontWeight: "bold" }, dynamicStyles.label]}
        >
          Tipos de Producción:
        </Text>
        {tiposProduccion.map((tipo) => (
          <Controller
            key={tipo}
            control={control}
            name="ganadera.tiposProduccion"
            render={({ field: { value = [], onChange } }) => (
              <ThemedCheckbox
                label={tipo}
                value={tipo}
                isSelected={value.includes(tipo)}
                onPress={() => {
                  const newValue = value.includes(tipo)
                    ? value.filter((item) => item !== tipo)
                    : [...value, tipo];
                  onChange(newValue);
                }}
              />
            )}
          />
        ))}
      </View>

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.LECHE
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción de Leche
          </Text>

          <Controller
            control={control}
            name="ganadera.produccionLecheCantidad"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Cantidad de producción"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            control={control}
            name="ganadera.produccionLecheUnidad"
            render={({ field: { value, onChange } }) => (
              <ThemedPicker
                items={unidadLeche.map((unidad) => ({
                  label: unidad,
                  value: unidad,
                }))}
                selectedValue={value ?? ""}
                onValueChange={onChange}
                placeholder="Unidad de medida"
              />
            )}
          />

          <Controller
            control={control}
            name="ganadera.vacasOrdeño"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Vacas en ordeño"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            control={control}
            name="ganadera.vacasSecas"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Vacas secas"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <Controller
            control={control}
            name="ganadera.terneros"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Terneros"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <Text
            style={{
              fontWeight: "bold",
              fontSize: dynamicStyles.label.fontSize,
            }}
          >
            Fecha promedio de secado
          </Text>
          <ThemedButton
            variant="outline"
            icon="calendar-outline"
            onPress={() => showDatePickerModal("ganadera.fechaPromedioSecado")}
            title={
              watch("ganadera.fechaPromedioSecado") ||
              "Seleccionar fecha promedio de secado"
            }
            style={{ marginBottom: dynamicStyles.inputMargin }}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.CARNE_BOVINA
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción de Carne Bovina
          </Text>
          <Controller
            control={control}
            name="ganadera.cabezasEngordeBovino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Cabezas en engorde"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.kilosSacrificioBovino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Kilos de sacrificio"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.CARNE_PORCINA
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción de Carne Porcina
          </Text>
          <Controller
            control={control}
            name="ganadera.cerdosEngorde"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Cabezas en engorde"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.pesoPromedioCerdo"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Peso promedio de cerdos (Kg)"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.edadSacrificioProcino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Edad sacrificio"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.CARNE_AVE
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción Carne de Ave
          </Text>
          <Controller
            control={control}
            name="ganadera.mortalidadLoteAves"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Mortalidad del lote"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.HUEVO
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción de Huevo
          </Text>
          <Controller
            control={control}
            name="ganadera.huevosPorDia"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Huevos por dia"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.gallinasPonedoras"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Total gallinas ponedoras"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.calidadHuevo"
            render={({ field: { value, onChange } }) => (
              <ThemedPicker
                items={itemsHuevos}
                placeholder="Total gallinas ponedoras"
                selectedValue={value?.toString() ?? ""}
                onValueChange={(text) => onChange(Number(text))}
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.CARNE_CAPRINO
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Producción de Carne Caprino
          </Text>
          <Controller
            control={control}
            name="ganadera.animalesEngordeCaprino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Animales en engorde"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.pesoPromedioCaprino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Peso promedio animales (kg)"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.edadSacrificioCaprino"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Edad al sacrificio"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.GANADO_PIE
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Ganado en Pie
          </Text>
          <Controller
            control={control}
            name="ganadera.animalesDisponibles"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Animales disponibles"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.pesoPromedioCabeza"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Peso promedio por cabeza (kg)"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />

          <Divider style={styles.divider} />
        </View>
      )}

      {watch("ganadera.tiposProduccion")?.includes(
        TipoProduccionGanadera.OTRO
      ) && (
        <View style={[styles.subSection, dynamicStyles.subSection]}>
          <Text style={[styles.subSectionTitle, dynamicStyles.subSectionTitle]}>
            Otro tipo de producción
          </Text>
          <Controller
            control={control}
            name="ganadera.otroProductoNombre"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Nombre del producto"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.otroProductoUnidadMedida"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Unidad de medida"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="ganadera.otroProductoProduccionMensual"
            render={({ field: { value, onChange } }) => (
              <ThemedTextInput
                placeholder="Producción mensual"
                value={value?.toString()}
                onChangeText={(text) => onChange(Number(text))}
                keyboardType="numeric"
              />
            )}
          />
          <Divider style={styles.divider} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  checkboxGroup: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    color: "#555",
  },
  subSection: {
    borderRadius: 8,
  },
  subSectionTitle: {
    fontWeight: "600",
    color: "#444",
  },
  divider: {
    backgroundColor: "#D7CCC8",
  },
});

export default GanaderaSection;
