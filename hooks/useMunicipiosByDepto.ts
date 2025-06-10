import { obtenerMunicipiosDeptoById } from "@/core/municipios/accions/obtener-municipiosByDepto";
import { useQuery } from "@tanstack/react-query";

const useMunicipiosByDepto = (deptoId: string) => {
  return useQuery({
    queryKey: ["miunicipio-depto", deptoId],
    queryFn: () => obtenerMunicipiosDeptoById(deptoId),
    retry: 0,
  });
};

export default useMunicipiosByDepto;
