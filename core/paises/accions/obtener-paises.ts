import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { PaisesResponse } from "../interfaces/paises.response.interface";

export const obtenerPaises = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/pais`;

  const response = await veterinariaAPI.get<PaisesResponse[]>(url);
  return response;
};
