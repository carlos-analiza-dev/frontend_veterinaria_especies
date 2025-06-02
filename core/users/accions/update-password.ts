import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ChangePassword } from "../interfaces/change-password.interface";

export const CambiarContraseña = async (data: ChangePassword) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/change-password`;
  const respose = await veterinariaAPI.post(url, data);
  return respose;
};
