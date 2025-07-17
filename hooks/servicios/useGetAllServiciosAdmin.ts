import { getServicios } from "@/core/servicios/accions/obtener-servicios";
import { useQuery } from "@tanstack/react-query";

const useGetAllServiciosAdmin = () => {
  return useQuery({
    queryKey: ["all-servicios-admin"],
    queryFn: getServicios,
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetAllServiciosAdmin;
