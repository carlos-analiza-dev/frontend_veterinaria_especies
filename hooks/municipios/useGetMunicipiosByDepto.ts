import { obtenerMunicipiosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import { useQuery } from "@tanstack/react-query";

const useGetMunicipiosByDepto = (deptoId: string) => {
  return useQuery({
    queryKey: ["municipios-depto", deptoId],
    queryFn: () => obtenerMunicipiosDeptoById(deptoId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetMunicipiosByDepto;
