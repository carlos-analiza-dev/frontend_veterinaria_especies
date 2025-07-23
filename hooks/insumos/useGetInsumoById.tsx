import { ObtenerInsumoById } from "@/core/insumos/accions/get-userById";
import { useQuery } from "@tanstack/react-query";

const useGetInsumoById = (id: string) => {
  return useQuery({
    queryKey: ["insumo-id", id],
    queryFn: () => ObtenerInsumoById(id),
    staleTime: 60 * 5 * 100,
    retry: false,
  });
};

export default useGetInsumoById;
