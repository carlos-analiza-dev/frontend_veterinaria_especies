import { veterinariaAPI } from "@/core/api/veterinariaApi";

export const eliminarImagenAnimal = async (imageId: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/images-aminales/${imageId}`;

  const response = await veterinariaAPI.delete(url);
  return response;
};
