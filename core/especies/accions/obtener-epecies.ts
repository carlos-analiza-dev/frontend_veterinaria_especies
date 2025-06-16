import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseEspecies } from "../interfaces/response-especies.interface";

export const ObtenerEspecies = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/especie-animal`;

  const response = await veterinariaAPI.get<ResponseEspecies[]>(url);
  return response;
};
