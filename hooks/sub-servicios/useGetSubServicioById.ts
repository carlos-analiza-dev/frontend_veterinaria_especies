import { ObtenerSubServiciosById } from "@/core/sub-servicio/accions/get-sub-serviciosById";
import { useQuery } from "@tanstack/react-query";

const useGetSubServicioById = (servicioId: string) => {
  return useQuery({
    queryKey: ["sub-servicios", servicioId],
    queryFn: () => ObtenerSubServiciosById(servicioId),
    retry: 0,
  });
};

export default useGetSubServicioById;
