import { ObtenerHorasByFecha } from "@/core/horarios/accions/get-horas-fecha";
import { useQuery } from "@tanstack/react-query";

const useGetHorasMedicoByFecha = (
  medicoId: string,
  fecha: string,
  duracion: string
) => {
  return useQuery({
    queryKey: ["horario-medico", medicoId, fecha, duracion],
    queryFn: () => ObtenerHorasByFecha(medicoId, fecha, duracion),
    retry: 0,
  });
};

export default useGetHorasMedicoByFecha;
