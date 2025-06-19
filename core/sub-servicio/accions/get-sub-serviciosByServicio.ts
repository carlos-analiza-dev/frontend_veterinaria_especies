import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseSubServicios } from "../interface/obtener-sub-serviciosbyservicio.interface";

export const ObtenerSubServiciosByServicioId = async (servicioId: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/sub-servicios/servicio/${servicioId}`;

  const response = await veterinariaAPI.get<ResponseSubServicios[]>(url);
  return response;
};
