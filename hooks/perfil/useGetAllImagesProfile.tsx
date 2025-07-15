import { obtenerTodasImages } from "@/core/profile-images/core/obtener-image-all-images";
import { useQuery } from "@tanstack/react-query";

const useGetAllImagesProfile = (userId: string) => {
  return useQuery({
    queryKey: ["all-images-perfil", userId],
    queryFn: () => obtenerTodasImages(userId),
    staleTime: 60 * 100 * 5,
    retry: 0,
    enabled: !!userId,
  });
};

export default useGetAllImagesProfile;
