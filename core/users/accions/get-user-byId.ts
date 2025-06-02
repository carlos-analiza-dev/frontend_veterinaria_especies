import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { User } from "../interfaces/users-response.interface";

export const obtenerUsuarioById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/user/${id}`;
  const respose = await veterinariaAPI.get<User>(url);
  return respose;
};
