import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Medico } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicoById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/medicos/${id}`;
  const response = await veterinariaAPI.get<Medico>(url);
  return response.data;
};
