export interface ResponseUsers {
  users: User[];
  total: number;
}

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
}

export interface Pais {
  id: string;
  nombre: string;
  isActive: boolean;
}
