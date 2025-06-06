import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearServicePrecio } from "../interfaces/crear-servicio-precio.interface";

export const updateServicioPrecio = async (
  data: Partial<CrearServicePrecio>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios-pais`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
