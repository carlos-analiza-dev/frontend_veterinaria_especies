export interface ResponseInsumosInterface {
  data: Insumo[];
  total: number;
}

export interface Insumo {
  id: string;
  cantidadSku: number;
  categorias: string[];
  materiaPrima: string;
  intereses: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
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
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: any[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
  departamentos: Departamento[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
