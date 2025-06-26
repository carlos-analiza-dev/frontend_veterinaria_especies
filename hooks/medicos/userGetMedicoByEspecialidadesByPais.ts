import { ObtenerMedicoByEspecialidadesByPais } from "@/core/medicos/accions/obetener_medico_byEspecialidadByPais";
import { useQuery } from "@tanstack/react-query";

const userGetMedicoByEspecialidadesByPais = (
  paisId: string,
  especialidadId: string
) => {
  return useQuery({
    queryKey: ["medico-especialidad-pais", paisId, especialidadId],
    queryFn: () => ObtenerMedicoByEspecialidadesByPais(paisId, especialidadId),
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default userGetMedicoByEspecialidadesByPais;
