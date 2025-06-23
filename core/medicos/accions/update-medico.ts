import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearMedicoInterface } from "../interfaces/crear-medico.interface";

export const ActualizarMedico = async (
  id: string,
  data: Partial<CrearMedicoInterface>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/medicos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
