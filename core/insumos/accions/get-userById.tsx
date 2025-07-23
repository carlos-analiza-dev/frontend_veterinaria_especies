import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseInsumosInterface } from "../interfaces/response-insumos.interface";

export const ObtenerInsumoById = async (id: string) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos-usuario/${id}`;

  const response = await veterinariaAPI.get<ResponseInsumosInterface>(url);
  return response.data;
};
