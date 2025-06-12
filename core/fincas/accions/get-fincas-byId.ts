import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Finca } from "../interfaces/response-fincasByPropietario.interface";

export const ObtenerFincasById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/fincas-ganadero/${id}`;

  const response = await veterinariaAPI.get<Finca>(url);
  return response;
};
