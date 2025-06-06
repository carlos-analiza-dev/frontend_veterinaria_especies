import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseServicios } from "../interfaces/response-servicios.interface";

export const ObtenerServicio = async (limit: number, offset: number) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response;
};

export const getServicios = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios`;

  const response = await veterinariaAPI.get<ResponseServicios>(url);
  return response;
};
