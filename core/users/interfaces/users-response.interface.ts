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
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
  role: Role;
  profileImages: ProfileImage[];
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
