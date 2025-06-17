import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CrearAnimalByFinca } from "../interfaces/crear-animal.interface";

export const ActualizarAnimal = async (
  id: string,
  data: Partial<CrearAnimalByFinca>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/animal-finca/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
