import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseServicios } from "../interfaces/response-servicios.interface";

export const getServiciosActivos = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios/activos`;

  const response = await veterinariaAPI.get<ResponseServicios[]>(url);
  return response.data;
};
