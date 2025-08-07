import { ObtenerInsumos } from "@/core/insumos-inventario/accions/obtener-insumos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetInsumos = () => {
  return useQuery({
    queryKey: ["obtener-insumos"],
    queryFn: ObtenerInsumos,
    retry: false,
  });
};

export default useGetInsumos;
