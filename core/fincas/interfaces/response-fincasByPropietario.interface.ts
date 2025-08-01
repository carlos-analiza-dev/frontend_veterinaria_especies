export interface ResponseFincasByPropietario {
  fincas: Finca[];
  total: number;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  medida_finca: string;
  ubicacion: string;
  longitud: number;
  latitud: number;
  abreviatura: string;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: TipoExplotacion[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: string;
  isActive: boolean;
  departamento: Departamento;
  municipio: Departamento;
  propietario: Propietario;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface Propietario {
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
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}
