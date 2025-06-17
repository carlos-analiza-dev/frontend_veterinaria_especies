import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseAnimalesByPropietario } from "../interfaces/response-animales.interface";

export const ObtenerAnimalById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.get<ResponseAnimalesByPropietario>(url);

  return response;
};
