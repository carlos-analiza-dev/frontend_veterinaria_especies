import { Finca } from "@/core/citas/interfaces/response-citas-user.interface";
import { Linking } from "react-native";

export const handleOpenMap = (finca: Finca) => {
  const { latitud, longitud, nombre_finca } = finca;

  const url = `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}&query_place_id=${nombre_finca}`;

  Linking.openURL(url).catch(() => {
    alert(
      "No se pudo abrir el mapa. Verifica que tengas una aplicación instalada."
    );
  });
};
