import { obtenerMunicipiosActivosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import { useQuery } from "@tanstack/react-query";

const useGetMunicipiosActivosByDepto = (departamentoId: string) => {
  return useQuery({
    queryKey: ["municipios-activos", departamentoId],
    queryFn: () => obtenerMunicipiosActivosDeptoById(departamentoId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!departamentoId,
  });
};

export default useGetMunicipiosActivosByDepto;
