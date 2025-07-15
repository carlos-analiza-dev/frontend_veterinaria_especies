import { veterinariaAPI } from "@/core/api/veterinariaApi";

export const eliminarImagen = async (imageId: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/profile-images/${imageId}`;

  const response = await veterinariaAPI.delete(url);
  return response;
};
