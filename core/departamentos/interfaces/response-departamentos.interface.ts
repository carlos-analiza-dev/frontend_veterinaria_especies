export interface ResponseDeptos {
  departamentos: Departamento[];
  total: number;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios: Municipio[];
}

export interface Municipio {
  id: string;
  nombre: string;
}
