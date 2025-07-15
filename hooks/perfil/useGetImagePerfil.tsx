import { obtenerPerfil } from "@/core/profile-images/core/obtener-image-perfil";
import { useQuery } from "@tanstack/react-query";

const useGetImagePerfil = () => {
  return useQuery({
    queryKey: ["perfil-users"],
    queryFn: () => obtenerPerfil(),
    staleTime: 60 * 100 * 5,
    retry: 0,
  });
};

export default useGetImagePerfil;
