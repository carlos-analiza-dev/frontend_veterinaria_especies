import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { PaisesResponse } from "../interfaces/paises.response.interface";

export const obtenerPaisById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/pais/${id}`;

  const response = await veterinariaAPI.get<PaisesResponse>(url);
  return response;
};
