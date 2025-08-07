import { ObtenerCitasPendientesByMedico } from "@/core/citas/accions/obtener-citas-pencientes-by-medico";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetCitasPendientesByMedico = (id: string, limit: number) => {
  return useInfiniteQuery({
    queryKey: ["citas-pendientes-medico", id, limit],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerCitasPendientesByMedico(id, limit, pageParam * limit),
    retry: false,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },

    enabled: !!id,
    refetchInterval: 10000,
  });
};

export default useGetCitasPendientesByMedico;
