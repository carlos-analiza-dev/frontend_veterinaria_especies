import { ObtenerCitasByUser } from "@/core/citas/accions/obtener-citas-byuser";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetCitasByUser = (id: string, limit: number) => {
  return useInfiniteQuery({
    queryKey: ["citas-user", id, limit],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerCitasByUser(id, limit, pageParam * limit),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export default useGetCitasByUser;
