import { ObtenerHorariosByMedico } from "@/core/horarios/accions/get-horariosbyMedico";
import { useQuery } from "@tanstack/react-query";

const useGetHorariosByMedico = (medicoId: string) => {
  return useQuery({
    queryKey: ["horario-medico", medicoId],
    queryFn: () => ObtenerHorariosByMedico(medicoId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!medicoId,
  });
};

export default useGetHorariosByMedico;
