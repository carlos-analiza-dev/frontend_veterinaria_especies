import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateProduccionFinca } from "../interface/crear-produccion-finca.interface";

export const CrearProduccionFinca = async (data: CreateProduccionFinca) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/produccion-finca`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
