import { ObtenerInsumosByUser } from "@/core/insumos/accions/get-insumos-user";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetInsumosByUser = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["insumos-user"],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerInsumosByUser(limit, pageParam * limit),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export default useGetInsumosByUser;
