import { ObtenerMedicos } from "@/core/medicos/accions/obtener-medicos";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetMedicos = (limit: number, offset: number, name: string) => {
  return useInfiniteQuery({
    queryKey: ["medicos", limit, offset, name],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerMedicos(limit, pageParam * limit, name),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export default useGetMedicos;
