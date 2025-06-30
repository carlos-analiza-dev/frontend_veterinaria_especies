import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseFincasByPropietario } from "../interfaces/response-fincasByPropietario.interface";

export const ObtenerFincasByPropietario = async (id: string, name?: string) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/fincas-ganadero/fincas/${id}`;

  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if ([...params].length > 0) {
    url += `?${params.toString()}`;
  }

  const response = await veterinariaAPI.get<ResponseFincasByPropietario>(url);
  return response;
};
