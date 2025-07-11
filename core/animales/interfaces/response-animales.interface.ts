export interface ResponseAnimalesByPropietario {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  edad_promedio: number;
  fecha_nacimiento: string;
  observaciones: null | string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: ComplementoElement[];
  pureza: string;
  tipo_reproduccion: string;
  medicamento: string;
  nombre_padre: string;
  arete_padre: null | string;
  raza_padre: null | string;
  nombre_criador_padre: null | string;
  nombre_propietario_padre: null | string;
  nombre_finca_origen_padre: string;
  compra_padre: boolean;
  nombre_criador_origen_padre: string;
  nombre_madre: string;
  arete_madre: null | string;
  raza_madre: null | string;
  nombre_criador_madre: null | string;
  nombre_propietario_madre: null | string;
  nombre_finca_origen_madre: string;
  numero_parto_madre: number;
  compra_madre: boolean;
  nombre_criador_origen_madre: string;
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  finca: Finca;
  propietario: Propietario;
  especie: EspecieClass;
  raza: EspecieClass;
}

export interface ComplementoElement {
  complemento: string;
}

export interface EspecieClass {
  id: string;
  nombre: string;
  isActive: boolean;
  abreviatura?: string;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: Abreviatura;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: TipoExplotacionElement[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export enum Abreviatura {
  LM = "LM",
  Lg = "LG",
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
  origen: string;
  alimento: string;
}
