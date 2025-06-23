import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseVeterinarios } from "../interfaces/veterinarios-response.interface";

export const obtenerVeterinarios = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/veterinarios`;
  const respose = await veterinariaAPI.get<ResponseVeterinarios[]>(url);
  return respose.data;
};
