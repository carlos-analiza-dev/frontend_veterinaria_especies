import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseCitasPendientesMedicosInterface } from "@/core/medicos/interfaces/obtener-citas-medicos.interface";

export const ObtenerCitasPendientesByMedico = async (
  id: string,
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/citas/medico/${id}?limit=${limit}&offset=${offset}`;

  const response =
    await veterinariaAPI.get<ResponseCitasPendientesMedicosInterface>(url);
  return response.data;
};
