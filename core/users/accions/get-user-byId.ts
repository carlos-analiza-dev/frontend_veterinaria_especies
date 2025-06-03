import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { User, UserUpdateData } from "@/core/auth/interfaces/user";

export const obtenerUsuarioById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/user/${id}`;
  const respose = await veterinariaAPI.get<User>(url);
  return respose;
};

export const actualizarUsuario = async (
  userId: string,
  userData: UserUpdateData
): Promise<User> => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/auth/user-update/${userId}`;

  const response = await veterinariaAPI.patch<User>(url, userData);
  return response.data;
};
