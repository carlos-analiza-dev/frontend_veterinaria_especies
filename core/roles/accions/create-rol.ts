import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateRolI } from "../interfaces/crear-rol.interface";

export const AddRol = async (data: CreateRolI) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/roles`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
