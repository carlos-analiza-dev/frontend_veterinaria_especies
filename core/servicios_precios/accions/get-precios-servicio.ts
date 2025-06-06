import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseServicioPrecio } from "../interfaces/response-servicio-precio.interface";

export const ObtenerServicioPricesId = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/servicios-pais/servicio/${id}`;

  const response = await veterinariaAPI.get<ResponseServicioPrecio[]>(url);
  return response;
};
