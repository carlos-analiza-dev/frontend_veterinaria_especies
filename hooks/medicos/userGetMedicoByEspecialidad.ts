import { ObtenerMedicoByEspecialidad } from "@/core/medicos/accions/obetener_medico_byEspecialidad";
import { useQuery } from "@tanstack/react-query";

const userGetMedicoByEspecialidad = (especialidadId: string) => {
  return useQuery({
    queryKey: ["medico-especialidad", especialidadId],
    queryFn: () => ObtenerMedicoByEspecialidad(especialidadId),
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default userGetMedicoByEspecialidad;
