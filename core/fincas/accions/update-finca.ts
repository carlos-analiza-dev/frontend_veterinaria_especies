import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearFinca } from "../interfaces/crear-finca.interface";

export const ActualizarFinca = async (
  id: string,
  data: Partial<CrearFinca>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/fincas-ganadero/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
