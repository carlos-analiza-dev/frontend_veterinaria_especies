import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseAnimalesByPropietario } from "../interfaces/response-animales.interface";

export const ObtenerAnimalesByPropietario = async (
  propietarioId: string,
  fincaId?: string
) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca/propietario-animales/${propietarioId}`;

  if (fincaId) {
    url += `?fincaId=${fincaId}`;
  }

  const response = await veterinariaAPI.get<ResponseAnimalesByPropietario[]>(
    url
  );
  return response;
};
