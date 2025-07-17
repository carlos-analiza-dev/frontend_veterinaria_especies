import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Animal } from "../interfaces/response-animales.interface";

export const ObtenerAnimalesByFincaEspRaza = async (
  fincaId: string,
  especieId: string,
  razaId: string
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca/animales/${fincaId}/${especieId}/${razaId}`;

  const response = await veterinariaAPI.get<Animal[]>(url);

  return response;
};
