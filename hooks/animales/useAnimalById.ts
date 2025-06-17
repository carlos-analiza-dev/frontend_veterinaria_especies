import { ObtenerAnimalById } from "@/core/animales/accions/get-animales-byId";

import { useQuery } from "@tanstack/react-query";

const useAnimalById = (id: string) => {
  return useQuery({
    queryKey: ["animal-id", id],
    queryFn: () => ObtenerAnimalById(id),
    retry: 0,
  });
};

export default useAnimalById;
