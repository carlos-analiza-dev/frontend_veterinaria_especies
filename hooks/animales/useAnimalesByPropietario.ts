import { ObtenerAnimalesByPropietario } from "@/core/animales/accions/get-animales-bypropietario";
import { useQuery } from "@tanstack/react-query";

const useAnimalesByPropietario = (propietarioId: string, fincaId?: string) => {
  return useQuery({
    queryKey: ["animales-propietario", propietarioId, fincaId],
    queryFn: () => ObtenerAnimalesByPropietario(propietarioId, fincaId),
    retry: 0,
  });
};

export default useAnimalesByPropietario;
