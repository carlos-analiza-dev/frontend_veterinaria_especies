import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateDepartamento } from "../interfaces/create-departamento.interface";

export const CrearDepto = async (data: CreateDepartamento) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/departamentos-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
