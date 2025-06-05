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
  departamento: Departamento;
  municipio: Municipio;
}

export interface Departamento {
  id: string;
  nombre: DepartamentoNombre;
  municipios: Municipio[];
}

export interface Municipio {
  id: string;
  nombre: MunicipioNombre;
}

export enum MunicipioNombre {
  AntiguoCuscatlán = " Antiguo Cuscatlán",
}

export enum DepartamentoNombre {
  SANSalvador = "San Salvador",
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
