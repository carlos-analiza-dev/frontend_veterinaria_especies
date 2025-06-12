import { obtenerDeptosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { useQuery } from "@tanstack/react-query";

const useGetDepartamentosByPais = (paisId: string) => {
  return useQuery({
    queryKey: ["departamentos-pais", paisId],
    queryFn: () => obtenerDeptosPaisById(paisId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetDepartamentosByPais;
