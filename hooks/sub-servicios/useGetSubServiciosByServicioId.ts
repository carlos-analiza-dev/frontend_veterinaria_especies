import { ObtenerSubServiciosByServicioId } from "@/core/sub-servicio/accions/get-sub-serviciosByServicio";
import { useQuery } from "@tanstack/react-query";

const useGetSubServiciosByServicioId = (servicioId: string) => {
  return useQuery({
    queryKey: ["sub-servicios", servicioId],
    queryFn: () => ObtenerSubServiciosByServicioId(servicioId),
    retry: 0,
  });
};

export default useGetSubServiciosByServicioId;
