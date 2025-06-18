import { obtenerPaisesActivos } from "@/core/paises/accions/obtener-paises";
import { useQuery } from "@tanstack/react-query";

const useGetPaisesActivos = () => {
  return useQuery({
    queryKey: ["paises-activos"],
    queryFn: obtenerPaisesActivos,
    staleTime: 60 * 100 * 5,
    retry: 0,
  });
};

export default useGetPaisesActivos;
