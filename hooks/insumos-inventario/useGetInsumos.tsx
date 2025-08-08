import { ObtenerInsumos } from "@/core/insumos-inventario/accions/obtener-insumos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetInsumos = () => {
  return useQuery({
    queryKey: ["obtener-insumos"],
    queryFn: ObtenerInsumos,
    retry: false,
    refetchInterval: 10000,
  });
};

export default useGetInsumos;
