import { ObtenerFincasByPropietario } from "@/core/fincas/accions/get-fincas-by-propietario";
import { useQuery } from "@tanstack/react-query";

export const useFincasPropietarios = (userId: string) => {
  return useQuery({
    queryKey: ["fincas-propietario", userId],
    queryFn: () => ObtenerFincasByPropietario(userId),
    retry: 0,
  });
};
