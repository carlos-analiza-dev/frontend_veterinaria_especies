import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseMunicipios } from "../interfaces/response-municipios.interface";

export const obtenerMunicipiosDeptoById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/municipios-departamentos-pais/municipios/${id}`;

  const response = await veterinariaAPI.get<ResponseMunicipios>(url);
  return response;
};
