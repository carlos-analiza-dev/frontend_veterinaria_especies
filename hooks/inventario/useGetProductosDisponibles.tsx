import { ObtenerProductosDisponiblesInvetario } from "@/core/inventario/accions/obtener-productos-inventario";
import { useQuery } from "@tanstack/react-query";

const useGetProductosDisponibles = () => {
  return useQuery({
    queryKey: ["productos-disponibles"],
    queryFn: ObtenerProductosDisponiblesInvetario,
    retry: false,
  });
};

export default useGetProductosDisponibles;
