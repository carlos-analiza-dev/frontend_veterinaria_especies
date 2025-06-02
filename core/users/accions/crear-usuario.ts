import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearUsuario } from "../interfaces/create-user.interface";

export const CreateUser = async (data: CrearUsuario) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/register`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
