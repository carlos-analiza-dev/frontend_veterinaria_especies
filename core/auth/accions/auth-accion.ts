import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Departamento, Municipio, Pais } from "../interfaces/user";

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  rol: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Municipio;
  token: string;
}

export const returnUserToken = (data: AuthResponse) => {
  const { token, ...user } = data;

  return { user, token };
};

export const authLogin = async (email: string, password: string) => {
  email.toLowerCase();
  try {
    const { data } = await veterinariaAPI.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    return returnUserToken(data);
  } catch (error) {
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
