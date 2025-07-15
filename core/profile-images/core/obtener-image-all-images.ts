import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseAllImages } from "../interfaces/response-all-images";

export const obtenerTodasImages = async (userId: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/profile-images/all-images/${userId}`;

  const response = await veterinariaAPI.get<ResponseAllImages[]>(url);
  return response;
};
