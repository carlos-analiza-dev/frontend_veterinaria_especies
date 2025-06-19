import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearSubServicio } from "../interface/crear-sub-servicio.interface";

export const AddSubServicio = async (data: CrearSubServicio) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/sub-servicios`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
