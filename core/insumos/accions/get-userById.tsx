import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Insumo } from "../interfaces/response-insumos.interface";

export const ObtenerInsumoById = async (id: string) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos-usuario/${id}`;

  const response = await veterinariaAPI.get<Insumo>(url);
  return response.data;
};
