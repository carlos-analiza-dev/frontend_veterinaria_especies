import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearInsumoInterface } from "../interfaces/crear-insumo.interface";

export const CrearInsumosByUser = async (data: CrearInsumoInterface) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos-usuario`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
