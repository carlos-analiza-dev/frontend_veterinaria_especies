import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Servicio } from "../interfaces/response-servicios.interface";

export const getServiciosActivos = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios/activos`;

  const response = await veterinariaAPI.get<Servicio[]>(url);
  return response.data;
};
