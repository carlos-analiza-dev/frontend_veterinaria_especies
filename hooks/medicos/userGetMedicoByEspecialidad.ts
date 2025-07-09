import { ObtenerMedicoByEspecialidadesByPais } from "@/core/medicos/accions/obetener_medico_byEspecialidadByPais";
import { useQuery } from "@tanstack/react-query";

const userGetMedicoByEspecialidad = (
  paisId: string,
  especialidadId: string
) => {
  return useQuery({
    queryKey: ["medico-especialidad", especialidadId, paisId],
    queryFn: () => ObtenerMedicoByEspecialidadesByPais(paisId, especialidadId),
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default userGetMedicoByEspecialidad;
