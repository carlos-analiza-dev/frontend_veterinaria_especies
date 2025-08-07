import { veterinariaAPI } from "@/core/api/veterinariaApi";

export const EditarCantidadInventario = async (
  insumoId: string,
  cantidadUsada: number
) => {
  let url = `${process.env.EXPO_PUBLIC_API_URL}/inventario/reducir`;

  const response = await veterinariaAPI.patch(url, {
    insumoId,
    cantidadUsada,
  });
  return response.data;
};
