import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponsePerfil } from "../interfaces/obtener-perfil.response.interfase";

export const obtenerPerfil = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/profile-images/current`;

  const response = await veterinariaAPI.get<ResponsePerfil>(url);
  return response;
};
