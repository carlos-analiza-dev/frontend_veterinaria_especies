export interface User {
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
  token: string;
}

export interface Pais {
  id: string;
  nombre: string;
  isActive: boolean;
}

export type UserUpdateData = {
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  rol: string;
  pais: string;
  isActive: boolean;
  isAuthorized: boolean;
};
