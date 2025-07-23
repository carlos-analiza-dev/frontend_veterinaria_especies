import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearAnalisisInterface } from "../interface/crear-analisis.interface";

export const CrearAnalisisSuelo = async (data: CrearAnalisisInterface) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/analisis-usuario`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
