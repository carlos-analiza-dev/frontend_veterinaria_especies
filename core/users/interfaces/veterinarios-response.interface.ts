export interface ResponseVeterinarios {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
