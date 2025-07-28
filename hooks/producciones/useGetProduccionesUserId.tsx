import { obtenerProduccionesByUserId } from "@/core/produccion/accions/obtener-producciones-userId";
import { useQuery } from "@tanstack/react-query";

const useGetProduccionesUserId = (userId: string) => {
  return useQuery({
    queryKey: ["producciones-user"],
    queryFn: () => obtenerProduccionesByUserId(userId),
    staleTime: 60 * 5 * 100,
    retry: 0,
  });
};

export default useGetProduccionesUserId;
