import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Animal } from "../interfaces/response-animales.interface";

export const ObtenerAnimalById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.get<Animal>(url);

  return response;
};
