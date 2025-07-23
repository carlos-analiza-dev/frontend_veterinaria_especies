import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseInsumosInterface } from "../interfaces/response-insumos.interface";

export const ObtenerInsumosByUser = async (
  limit: number = 10,
  offset: number = 0
) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos-usuario?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseInsumosInterface>(url);
  return response.data;
};
