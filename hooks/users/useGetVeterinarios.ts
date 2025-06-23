import { obtenerVeterinarios } from "@/core/users/accions/get-users-veterinarios";
import { useQuery } from "@tanstack/react-query";

const useGetVeterinarios = () => {
  return useQuery({
    queryKey: ["users-veterinarios"],
    queryFn: obtenerVeterinarios,
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetVeterinarios;
