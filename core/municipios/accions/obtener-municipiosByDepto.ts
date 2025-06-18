import { veterinariaAPI } from "@/core/api/veterinariaApi";
import {
  Municipio,
  ResponseMunicipios,
} from "../interfaces/response-municipios.interface";

export const obtenerMunicipiosDeptoById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/municipios-departamentos-pais/municipios/${id}`;

  const response = await veterinariaAPI.get<ResponseMunicipios>(url);
  return response;
};

export const obtenerMunicipiosActivosDeptoById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/municipios-departamentos-pais/municipios/activos/${id}`;

  const response = await veterinariaAPI.get<Municipio[]>(url);
  return response;
};
