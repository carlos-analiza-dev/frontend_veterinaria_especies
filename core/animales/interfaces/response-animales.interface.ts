export interface ResponseAnimalesByPropietario {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  edad_promedio: number;
  fecha_nacimiento: Date;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: Complemento[] | null;
  medicamento: null | string;
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  finca: Finca;
  propietario: Propietario;
  especie: Especie;
  raza: Raza;
}

export interface Complemento {
  complemento: string;
}

export interface Raza {
  id: string;
  nombre: string;
  isActive: boolean;
  abreviatura?: string;
}

export interface Especie {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: TipoExplotacionElement[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacionElement {
  tipo_explotacion: string;
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

export interface TipoAlimentacion {
  alimento: string;
  origen?: string;
}
