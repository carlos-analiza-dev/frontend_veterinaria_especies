import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateRolI } from "../interfaces/crear-rol.interface";

export const UpdateRol = async (id: string, data: Partial<CreateRolI>) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/roles/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
