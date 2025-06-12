import { obtenerUsuarios } from "@/core/users/accions/obtener-usuarios";
import { useInfiniteQuery } from "@tanstack/react-query";

const useGetUsersInfinityScroll = (
  debouncedSearchTerm: string,
  roleFilter: string,
  limit: number
) => {
  return useInfiniteQuery({
    queryKey: ["usuarios-admin", debouncedSearchTerm, roleFilter],
    queryFn: ({ pageParam = 0 }) =>
      obtenerUsuarios(
        limit,
        pageParam * limit,
        debouncedSearchTerm,
        roleFilter
      ),
    retry: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.data.total || 0;
      const loadedItems = allPages.length * limit;

      return loadedItems < totalItems ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};

export default useGetUsersInfinityScroll;
