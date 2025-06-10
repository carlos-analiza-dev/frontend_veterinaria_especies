import { obtenerDeptosPaisById } from "@/core/departamentos/accions/obtener-departamentosByPaid";
import { useQuery } from "@tanstack/react-query";

export const useDepartamentosPorPais = (paisId: string) => {
  return useQuery({
    queryKey: ["departamentos-pais", paisId],
    queryFn: () => obtenerDeptosPaisById(paisId ?? ""),
    retry: 0,
  });
};
