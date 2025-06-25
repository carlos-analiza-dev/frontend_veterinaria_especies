import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseCitasInterface } from "../interfaces/response-citas-user.interface";

export const ObtenerCitasByUser = async (
  id: string,
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/citas/usuario/${id}?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseCitasInterface>(url);
  return response.data;
};
