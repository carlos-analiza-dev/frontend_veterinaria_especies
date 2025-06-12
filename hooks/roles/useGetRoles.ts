import { getRoles } from "@/core/roles/accions/all-roles";
import { useQuery } from "@tanstack/react-query";

const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
    staleTime: 60 * 100 * 5,
    retry: 0,
  });
};

export default useGetRoles;
