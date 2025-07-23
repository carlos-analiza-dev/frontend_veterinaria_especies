import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearInsumoInterface } from "../interfaces/crear-insumo.interface";

export const EditarInsumosByUser = async (
  id: string,
  data: Partial<CrearInsumoInterface>
) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos-usuario/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
