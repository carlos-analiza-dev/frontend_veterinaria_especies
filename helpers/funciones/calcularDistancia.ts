export async function obtenerDistanciaGoogleMaps(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): Promise<number | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.routes &&
      data.routes.length > 0 &&
      data.routes[0].legs &&
      data.routes[0].legs.length > 0
    ) {
      const distanciaMetros = data.routes[0].legs[0].distance.value;
      return distanciaMetros / 1000;
    }

    return null;
  } catch (error) {
    return null;
  }
}

export async function obtenerTiempoViajeGoogleMaps(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  modo: "driving" | "walking" | "bicycling" | "transit" = "driving"
): Promise<{
  tiempoTexto: string | null;
  tiempoSegundos: number | null;
  distanciaTexto: string | null;
  distanciaMetros: number | null;
} | null> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lon1}&destination=${lat2},${lon2}&mode=${modo}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data.routes &&
      data.routes.length > 0 &&
      data.routes[0].legs &&
      data.routes[0].legs.length > 0
    ) {
      const leg = data.routes[0].legs[0];
      return {
        tiempoTexto: leg.duration.text,
        tiempoSegundos: leg.duration.value,
        distanciaTexto: leg.distance.text,
        distanciaMetros: leg.distance.value,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

export function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number): number => (value * Math.PI) / 180;

  const R = 6371;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c;

  return distancia;
}
