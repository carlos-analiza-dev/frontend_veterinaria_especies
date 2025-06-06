import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearServicePrecio } from "../interfaces/crear-servicio-precio.interface";

export const AddServicioPrecio = async (data: CrearServicePrecio) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
