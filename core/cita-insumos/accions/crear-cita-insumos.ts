import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearCitaInsumos } from "../interface/crear-cita-insumo.interface";

export const CreateCitaInsumos = async (data: CrearCitaInsumos) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/cita-insumos`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
