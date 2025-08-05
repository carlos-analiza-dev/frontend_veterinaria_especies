import { ObtenerProduccionByUserInterface } from "@/core/produccion/interface/obter-producciones-userId.interface";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
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
  const windowWidth = Dimensions.get("window").width;
  const isSmallScreen = windowWidth < 375;

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

  const dynamicStyles = {
    card: {
      margin: isSmallScreen ? 4 : 8,
      marginBottom: isSmallScreen ? 8 : 12,
      elevation: 3,
    },
    title: {
      fontSize: isSmallScreen ? 16 : 18,
    },
    chipText: {
      fontSize: isSmallScreen ? 12 : 14,
    },
    divider: {
      marginVertical: isSmallScreen ? 8 : 12,
    },
  };

  return (
    <Card
      style={[
        styles.card,
        dynamicStyles.card,
        { backgroundColor: theme.colors.surface },
      ]}
    >
      <Card.Content>
        <ThemedText style={[styles.title, dynamicStyles.title]}>
          {finca.nombre_finca}
        </ThemedText>

        <View style={styles.chipContainer}>
          <Chip
            icon="cow"
            style={styles.chip}
            textStyle={dynamicStyles.chipText}
          >
            {finca.cantidad_animales} animales
          </Chip>
          <Chip
            icon="map-marker"
            style={styles.chip}
            textStyle={dynamicStyles.chipText}
          >
            {finca.area_ganaderia_hectarea} ha
          </Chip>
        </View>

        <Divider style={[styles.divider, dynamicStyles.divider]} />

        {ganadera && (
          <>
            <ProduccionGanaderaCard ganadera={ganadera} finca={finca} />
            <Divider style={[styles.divider, dynamicStyles.divider]} />
          </>
        )}

        {forrajesInsumo && (
          <>
            <ProduccionForrajesCard forrajesInsumo={forrajesInsumo} />
            <Divider style={[styles.divider, dynamicStyles.divider]} />
          </>
        )}

        {agricola && (
          <>
            <ProduccionAgricolaCard agricola={agricola} />
            <Divider style={[styles.divider, dynamicStyles.divider]} />
          </>
        )}

        {apicultura && (
          <>
            <ProduccionApiculturaCard apicultura={apicultura} />
            <Divider style={[styles.divider, dynamicStyles.divider]} />
          </>
        )}

        {alternativa && (
          <>
            <ProduccionAlternativaCard alternativa={alternativa} />
            <Divider style={[styles.divider, dynamicStyles.divider]} />
          </>
        )}

        <View style={styles.chipContainer}>
          {consumo_propio && (
            <Chip icon="home" textStyle={dynamicStyles.chipText}>
              Consumo propio
            </Chip>
          )}
          {produccion_venta && (
            <Chip icon="cash" textStyle={dynamicStyles.chipText}>
              Producción para venta
            </Chip>
          )}
          {produccion_mixta && (
            <Chip icon="layers" textStyle={dynamicStyles.chipText}>
              Producción mixta
            </Chip>
          )}
          {transformacion_artesanal && (
            <Chip icon="factory" textStyle={dynamicStyles.chipText}>
              Transformación artesanal
            </Chip>
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
    fontWeight: "bold",
    marginBottom: 4,
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
    maxWidth: "100%",
  },
  divider: {
    height: 1,
  },
});

export default ProduccionList;
