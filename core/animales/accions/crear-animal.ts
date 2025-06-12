import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";

export const ObtenerAnimalesByPropietario = async (
  data: CrearAnimalByFinca
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
