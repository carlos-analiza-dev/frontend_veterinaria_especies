import { ObtenerMedicoById } from "@/core/medicos/accions/obtener-medicoById";
import { useQuery } from "@tanstack/react-query";

const useGetMedicoById = (id: string) => {
  return useQuery({
    queryKey: ["medico-id", id],
    queryFn: () => ObtenerMedicoById(id),
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetMedicoById;
