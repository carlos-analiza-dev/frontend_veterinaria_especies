export interface CrearAnimalByFinca {
  especie: string;
  sexo: string;
  color: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos?: TipoComplemento[];
  medicamento?: string;
  identificador: string;
  razaIds: string[];
  edad_promedio?: number;
  fecha_nacimiento: string;
  observaciones?: string;
  animal_muerte?: boolean;
  razon_muerte?: string;
  propietarioId: string;
  fincaId: string;
  castrado: boolean;
  esterelizado: boolean;
  pureza: string;
  produccion: string;
  tipo_produccion: string;
  tipo_reproduccion: string;
  compra_animal?: boolean;
  nombre_criador_origen_animal?: string;

  nombre_padre?: string;
  arete_padre?: string;
  razas_padre?: string[];
  pureza_padre: string;
  nombre_criador_padre?: string;
  nombre_propietario_padre?: string;
  nombre_finca_origen_padre?: string;

  nombre_madre?: string;
  arete_madre?: string;
  razas_madre?: string[];
  pureza_madre: string;
  nombre_criador_madre?: string;
  nombre_propietario_madre?: string;
  nombre_finca_origen_madre?: string;
  numero_parto_madre?: number;
}

export interface TipoAlimentacion {
  alimento: string;
  origen: string;
  porcentaje_comprado?: number;
  porcentaje_producido?: number;
}

export interface TipoComplemento {
  complemento: string;
}
