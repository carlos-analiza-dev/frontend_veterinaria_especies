import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseProdDisponiblesInterface } from "../interface/response-productos-disponibles.interface";

export const ObtenerProductosDisponiblesInvetario = async () => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/inventario/productos-disponibles`;

  const response = await veterinariaAPI.get<ResponseProdDisponiblesInterface[]>(
    url
  );
  return response.data;
};
