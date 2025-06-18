import { obtenerDeptosActivosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { useQuery } from "@tanstack/react-query";

const useGetDeptosActivesByPais = (paisId: string) => {
  return useQuery({
    queryKey: ["departamentos-pais-activos", paisId],
    queryFn: () => obtenerDeptosActivosPaisById(paisId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!paisId,
  });
};

export default useGetDeptosActivesByPais;
