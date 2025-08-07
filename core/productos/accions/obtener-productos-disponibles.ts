import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseProductosDisponibles } from "../interfaces/response-productos-disponibles.interface";

export const ObtenerProductos = async () => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/productos/productos-disponibles`;

  const response = await veterinariaAPI.get<ResponseProductosDisponibles>(url);
  return response.data;
};
