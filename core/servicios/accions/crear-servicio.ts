import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearServicio } from "../interfaces/crear-servicio.interface";

export const AddServicio = async (data: CrearServicio) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
