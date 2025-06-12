import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { useQuery } from "@tanstack/react-query";

const usePaisesActives = () => {
  return useQuery({
    queryKey: ["paises-activos"],
    queryFn: obtenerPaises,
    staleTime: 60 * 100 * 5,
    retry: 0,
  });
};

export default usePaisesActives;
