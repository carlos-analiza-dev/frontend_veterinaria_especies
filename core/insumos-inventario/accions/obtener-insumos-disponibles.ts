import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseInsumosDisponibles } from "../interfaces/response-insumos-disponibles.interface";

export const ObtenerInsumos = async () => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/insumos/insumos-disponibles`;

  const response = await veterinariaAPI.get<ResponseInsumosDisponibles>(url);
  return response.data;
};
