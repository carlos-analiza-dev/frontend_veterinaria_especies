import { ObtenerFincasById } from "@/core/fincas/accions/get-fincas-byId";
import { useQuery } from "@tanstack/react-query";

const useFincasById = (fincaId: string) => {
  return useQuery({
    queryKey: ["fincasById", fincaId],
    queryFn: () => ObtenerFincasById(fincaId),
    retry: 0,
  });
};

export default useFincasById;
