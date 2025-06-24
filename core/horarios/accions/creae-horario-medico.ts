import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearHoarioInterface } from "../interface/crear-horario.interface";

export const CrearHorario = async (data: CrearHoarioInterface) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/horarios-medicos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
