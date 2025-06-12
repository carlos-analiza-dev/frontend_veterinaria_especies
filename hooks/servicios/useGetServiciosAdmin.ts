import { ObtenerServicio } from "@/core/servicios/accions/obtener-servicios";
import { useQuery } from "@tanstack/react-query";

const useGetServiciosAdmin = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["servicios-admin", limit, offset],
    queryFn: () => ObtenerServicio(limit, offset),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetServiciosAdmin;
