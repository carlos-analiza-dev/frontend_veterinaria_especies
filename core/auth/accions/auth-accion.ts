import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Departamento, Municipio, Pais, Role } from "../interfaces/user";

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  role: Role;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: string;
  pais: Pais;
  departamento: Departamento;
  municipio: Municipio;
  token: string;
}

export const returnUserToken = (data: AuthResponse) => {
  const { token, ...user } = data;

  const adaptedUser = {
    ...user,
    name: user.name,
  };

  return { user: adaptedUser, token };
};

export const authLogin = async (email: string, password: string) => {
  try {
    email = email.toLowerCase().trim();

    const { data } = await veterinariaAPI.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    if (!data) {
      return null;
    }

    return returnUserToken(data);
  } catch (error: any) {
    return null;
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await veterinariaAPI.get<AuthResponse>(
      "/auth/check-status"
    );
    return returnUserToken(data);
  } catch (error) {
    return null;
  }
};
