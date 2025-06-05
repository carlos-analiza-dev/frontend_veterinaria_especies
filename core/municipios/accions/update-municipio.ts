import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { CreateMunicipio } from "../interfaces/create-municipio.interface";

export const ActualizarMunicipio = async (
  id: string,
  data: Partial<CreateMunicipio>
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/municipios-departamentos-pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
