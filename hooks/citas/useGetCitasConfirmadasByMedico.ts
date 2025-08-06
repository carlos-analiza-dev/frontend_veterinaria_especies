import { ObtenerCitasConfirmadasByMedico } from "@/core/citas/accions/obtener-citas-confirmadas-by-medico";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetCitasConfirmadasByMedico = (id: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["obtener-citas-confirmadas", id],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerCitasConfirmadasByMedico(id, limit, pageParam * limit),
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total;
      const loadedItems = allPages.reduce(
        (acc, page) => acc + page.citas.length,
        0
      );
      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
    retry: false,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetCitasConfirmadasByMedico;
