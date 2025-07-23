import ObtenerAnalisisSuelo from "@/core/analisis_suelo/core/get-anailisis";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetAnalisisSuelo = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["analisis-suelo"],
    queryFn: ({ pageParam = 0 }) =>
      ObtenerAnalisisSuelo(limit, pageParam * limit),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.data.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export default useGetAnalisisSuelo;
