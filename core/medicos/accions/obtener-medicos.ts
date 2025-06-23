import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ObtenerMedicosInterface } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicos = async (
  limit: number,
  offset: number,
  name: string
) => {
  const url = `${
    process.env.EXPO_PUBLIC_API_URL
  }/medicos?limit=${limit}&offset=${offset}&name=${encodeURIComponent(name)}`;
  const response = await veterinariaAPI.get<ObtenerMedicosInterface>(url);
  return response.data;
};
