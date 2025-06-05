import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateMunicipio } from "../interfaces/create-municipio.interface";

export const CrearMunicipio = async (data: CreateMunicipio) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/municipios-departamentos-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
