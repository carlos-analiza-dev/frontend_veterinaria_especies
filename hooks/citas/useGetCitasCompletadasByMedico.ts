import { ObtenerCitasCompletadasByMedico } from "@/core/citas/accions/obtener-citas-completadas-by-medico";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetCitasCompletadasByMedico = (id: string, limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["obtener-citas-completadas", id],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerCitasCompletadasByMedico(id, limit, pageParam * limit),
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
    refetchInterval: 10000,
  });
};

export default useGetCitasCompletadasByMedico;
