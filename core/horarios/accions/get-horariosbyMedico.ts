import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseHorariosMedico } from "../interface/response-horarios-medico";

export const ObtenerHorariosByMedico = async (medicoId: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/horarios-medicos/medico/${medicoId}`;

  const response = await veterinariaAPI.get<ResponseHorariosMedico[]>(url);
  return response.data;
};
