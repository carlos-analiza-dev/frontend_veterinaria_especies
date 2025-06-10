export interface ResponseFincasByPropietario {
  fincas: Finca[];
  total: number;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  abreviatura: string;
  tamaño_total: string;
  area_ganaderia: string;
  tipo_explotacion: string;
  fecha_registro: Date;
  isActive: boolean;
  departamento: Departamento;
  municipio: Departamento;
  propietario: Propietario;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}

export interface Propietario {
  id: string;
  email: string;
  password: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
  role: Role;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
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
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
