import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseFincasByPropietario } from "../interfaces/response-fincasByPropietario.interface";

export const ObtenerFincasByPropietario = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/fincas-ganadero/fincas/${id}`;

  const response = await veterinariaAPI.get<ResponseFincasByPropietario>(url);
  return response;
};
