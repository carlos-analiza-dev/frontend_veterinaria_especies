import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseUsers } from "../interfaces/users-response.interface";

export const obtenerUsuarios = async (
  limit: number = 10,
  offset: number = 0,
  name: string = "",
  rol: string = ""
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/users?limit=${limit}&offset=${offset}&name=${name}&rol=${rol}`;
  const respose = await veterinariaAPI.get<ResponseUsers>(url);
  return respose;
};
