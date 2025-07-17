import { ObtenerAnimalesByPropietario } from "@/core/animales/accions/get-animales-bypropietario";
import { useInfiniteQuery } from "@tanstack/react-query";

const LIMIT = 5;

const useAnimalesByPropietario = (
  propietarioId: string,
  fincaId?: string,
  especieId?: string,
  identificador?: string
) => {
  return useInfiniteQuery({
    queryKey: [
      "animales-propietario",
      propietarioId,
      fincaId,
      especieId,
      identificador,
    ],
    queryFn: ({ pageParam = 0 }: { pageParam: number }) =>
      ObtenerAnimalesByPropietario(
        propietarioId,
        fincaId,
        especieId,
        identificador,
        {
          limit: LIMIT,
          offset: pageParam * LIMIT,
        }
      ),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce(
        (total, page) => total + page.data.length,
        0
      );
      return totalLoaded < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    retry: 0,
  });
};

export default useAnimalesByPropietario;
