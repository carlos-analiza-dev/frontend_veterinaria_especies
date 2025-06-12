import { obtenerPaisById } from "@/core/paises/accions/obtener-paisById";
import { useQuery } from "@tanstack/react-query";

const usePaisesById = (paisId: string) => {
  return useQuery({
    queryKey: ["pais-id", paisId],
    queryFn: () => obtenerPaisById(paisId),
    retry: 0,
  });
};

export default usePaisesById;
