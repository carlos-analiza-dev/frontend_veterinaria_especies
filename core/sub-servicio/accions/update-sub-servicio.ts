import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearSubServicio } from "../interface/crear-sub-servicio.interface";

export const UpdateSubServicio = async (
  id: string,
  data: Partial<CrearSubServicio>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/sub-servicios/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
