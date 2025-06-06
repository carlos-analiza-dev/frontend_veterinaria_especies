import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Servicio } from "../interfaces/response-servicios.interface";

export const ObtenerServicioId = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios/${id}`;

  const response = await veterinariaAPI.get<Servicio>(url);
  return response;
};
