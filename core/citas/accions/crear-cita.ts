import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearCitaInterface } from "../interfaces/crear-cita.interface";

export const CrearCita = async (data: CrearCitaInterface) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/citas`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
