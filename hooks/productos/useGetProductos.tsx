import { ObtenerProductos } from "@/core/productos/accions/obtener-productos-disponibles";
import { useQuery } from "@tanstack/react-query";

const useGetProductos = () => {
  return useQuery({
    queryKey: ["obtener-productos"],
    queryFn: ObtenerProductos,
    retry: false,
  });
};

export default useGetProductos;
