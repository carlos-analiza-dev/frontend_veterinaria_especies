import { obtenerUsuarioById } from "@/core/users/accions/get-user-byId";
import { useQuery } from "@tanstack/react-query";

const userById = (userId: string) => {
  return useQuery({
    queryKey: ["usuario", userId],
    queryFn: () => obtenerUsuarioById(userId),
    retry: 0,
  });
};

export default userById;
