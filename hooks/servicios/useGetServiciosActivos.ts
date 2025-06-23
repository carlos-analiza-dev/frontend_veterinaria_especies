import { getServiciosActivos } from "@/core/servicios/accions/obtener-servicios-activos";
import { useQuery } from "@tanstack/react-query";

const useGetServiciosActivos = () => {
  return useQuery({
    queryKey: ["servicios-activos"],
    queryFn: getServiciosActivos,
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetServiciosActivos;
