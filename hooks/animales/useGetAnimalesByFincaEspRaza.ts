import { ObtenerAnimalesByFincaEspRaza } from "@/core/animales/accions/get-animales-byFincaByEspecieByRaza";
import { useQuery } from "@tanstack/react-query";

const useGetAnimalesByFincaEspRaza = (
  fincaId: string,
  especieId: string,
  razaId: string
) => {
  return useQuery({
    queryKey: ["animal-finca-esp", fincaId, especieId, razaId],
    queryFn: () => ObtenerAnimalesByFincaEspRaza(fincaId, especieId, razaId),
    retry: 0,
  });
};

export default useGetAnimalesByFincaEspRaza;
