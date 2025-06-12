import { ObtenerServicioId } from "@/core/servicios/accions/obtener-serviciobyId";
import { useQuery } from "@tanstack/react-query";

const useServicioById = (servicioId: string) => {
  return useQuery({
    queryKey: ["servicio-id", servicioId],
    queryFn: () => ObtenerServicioId(servicioId),
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useServicioById;
