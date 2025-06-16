import { ObtenerAnimalesByPropietario } from "@/core/animales/accions/get-animales-bypropietario";
import { useQuery } from "@tanstack/react-query";

const useAnimalesByPropietario = (
  propietarioId: string,
  fincaId?: string,
  identificador?: string
) => {
  return useQuery({
    queryKey: ["animales-propietario", propietarioId, fincaId, identificador],
    queryFn: () =>
      ObtenerAnimalesByPropietario(propietarioId, fincaId, identificador),
    retry: 0,
  });
};

export default useAnimalesByPropietario;
