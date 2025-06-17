export interface ResponseAnimalesByPropietario {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  edad_promedio: string;
  fecha_nacimiento: string;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  fecha_registro: string;
  castrado: boolean;
  esterelizado: boolean;
  finca: Finca;
  propietario: Propietario;
  especie: Especie;
  raza: Raza;
}

export interface Especie {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Raza {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  abreviatura: string;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: string;
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
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
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
}

export interface TipoAlimentacion {
  alimento: string;
}
