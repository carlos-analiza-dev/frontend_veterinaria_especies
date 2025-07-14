import { ObtenerAnimalesByPropietario } from "@/core/animales/accions/get-animales-bypropietario";
import { useQuery } from "@tanstack/react-query";

const useAnimalesByPropietario = (
  propietarioId: string,
  fincaId?: string,
  especieId?: string,
  identificador?: string
) => {
  return useQuery({
    queryKey: [
      "animales-propietario",
      propietarioId,
      fincaId,
      especieId,
      identificador,
    ],
    queryFn: () =>
      ObtenerAnimalesByPropietario(
        propietarioId,
        fincaId,
        especieId,
        identificador
      ),
    retry: false,
  });
};

export default useAnimalesByPropietario;
