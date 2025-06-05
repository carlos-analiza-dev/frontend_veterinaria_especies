import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateDepartamento } from "../interfaces/create-departamento.interface";

export const ActualizarDepto = async (
  id: string,
  data: Partial<CreateDepartamento>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/departamentos-pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
