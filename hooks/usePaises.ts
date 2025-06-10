import { obtenerPaises } from "@/core/paises/accions/obtener-paises";
import { useQuery } from "@tanstack/react-query";

const usePaisesActives = () => {
  return useQuery({
    queryKey: ["paises-activos"],
    queryFn: obtenerPaises,
    retry: 0,
  });
};

export default usePaisesActives;
