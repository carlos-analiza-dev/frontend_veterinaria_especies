import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearMedicoInterface } from "../interfaces/crear-medico.interface";

export const CrearMedico = async (data: CrearMedicoInterface) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/medicos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
