import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearAnalisisInterface } from "../interface/crear-analisis.interface";

export const EditarAnalisisSuelo = async (
  id: string,
  data: Partial<CrearAnalisisInterface>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/analisis-usuario/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
