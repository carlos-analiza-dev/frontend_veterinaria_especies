import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Chip, Divider, useTheme } from "react-native-paper";
import { ThemedText } from "../../theme/components/ThemedText";
import ProduccionAgricolaCard from "./ProduccionAgricolaCard";
import ProduccionAlternativaCard from "./ProduccionAlternativaCard";
import ProduccionApiculturaCard from "./ProduccionApiculturaCard";
import ProduccionForrajesCard from "./ProduccionForrajesCard";
import ProduccionGanaderaCard from "./ProduccionGanaderaCard";

interface ProduccionGanaderaCardProps {
  produccion: ObtenerProduccionByUserInterface;
}

const ProduccionList: React.FC<ProduccionGanaderaCardProps> = ({
  produccion,
}) => {
  const theme = useTheme();
  const {
    finca,
    ganadera,
    agricola,
    alternativa,
    apicultura,
    forrajesInsumo,
    consumo_propio,
    produccion_mixta,
    produccion_venta,
    transformacion_artesanal,
  } = produccion;

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <ThemedText style={styles.title}>{finca.nombre_finca}</ThemedText>

        <View style={styles.chipContainer}>
          <Chip icon="cow" style={styles.chip}>
            {finca.cantidad_animales} animales
          </Chip>
          <Chip icon="map-marker" style={styles.chip}>
            {finca.area_ganaderia_hectarea} ha
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {ganadera && (
          <>
            <ProduccionGanaderaCard ganadera={ganadera} finca={finca} />
            <Divider style={styles.divider} />
          </>
        )}

        {forrajesInsumo && (
          <>
            <ProduccionForrajesCard forrajesInsumo={forrajesInsumo} />
            <Divider style={styles.divider} />
          </>
        )}

        {agricola && (
          <>
            <ProduccionAgricolaCard agricola={agricola} />
            <Divider style={styles.divider} />
          </>
        )}

        {apicultura && (
          <>
            <ProduccionApiculturaCard apicultura={apicultura} />
            <Divider style={styles.divider} />
          </>
        )}

        {alternativa && (
          <>
            <ProduccionAlternativaCard alternativa={alternativa} />
            <Divider style={styles.divider} />
          </>
        )}

        <View style={styles.chipContainer}>
          {consumo_propio && <Chip icon="home">Consumo propio</Chip>}
          {produccion_venta && <Chip icon="cash">Producción para venta</Chip>}
          {produccion_mixta && <Chip icon="layers">Producción mixta</Chip>}
          {transformacion_artesanal && (
            <Chip icon="factory">Transformación artesanal</Chip>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
    gap: 4,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 12,
    height: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
  },
  tiposContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  tipoChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: "#e3f2fd",
  },
});

export default ProduccionList;
