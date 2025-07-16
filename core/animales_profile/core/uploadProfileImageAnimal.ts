import { veterinariaAPI } from "@/core/api/veterinariaApi";

export const uploadProfileImageAnimal = async (
  uri: string,
  animalId: string
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/images-aminales/upload/${animalId}`;

  const formData = new FormData();
  const filename = uri.split("/").pop() || "image.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image`;

  formData.append("file", {
    uri,
    name: filename,
    type,
  } as any);

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
