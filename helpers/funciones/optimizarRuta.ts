import { Cita } from "@/core/citas/interfaces/response-citas-user.interface";
import { calcularDistancia } from "./calcularDistancia";

export async function optimizarRuta(
  citas: Cita[],
  ubicacionActual: { latitude: number; longitude: number }
) {
  const citasNoVisitadas = [...citas];
  const rutaOptimizada: Cita[] = [];
  let ubicacionActualTemp = { ...ubicacionActual };

  while (citasNoVisitadas.length > 0) {
    let indiceMasCercano = 0;
    let distanciaMasCercana = Infinity;

    for (let i = 0; i < citasNoVisitadas.length; i++) {
      const cita = citasNoVisitadas[i];
      if (!cita.finca.latitud || !cita.finca.longitud) continue;

      const distancia =
        (await calcularDistancia(
          ubicacionActualTemp.latitude,
          ubicacionActualTemp.longitude,
          cita.finca.latitud,
          cita.finca.longitud
        )) || Infinity;

      if (distancia < distanciaMasCercana) {
        distanciaMasCercana = distancia;
        indiceMasCercano = i;
      }
    }

    const citaMasCercana = citasNoVisitadas.splice(indiceMasCercano, 1)[0];
    rutaOptimizada.push(citaMasCercana);

    if (citaMasCercana.finca.latitud && citaMasCercana.finca.longitud) {
      ubicacionActualTemp = {
        latitude: citaMasCercana.finca.latitud,
        longitude: citaMasCercana.finca.longitud,
      };
    }
  }

  return rutaOptimizada;
}
