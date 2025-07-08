export interface CrearAnimalByFinca {
  especie: string;
  sexo: string;
  color: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos?: TipoComplemento[];
  medicamento?: string;
  identificador: string;
  raza: string;
  edad_promedio?: number;
  fecha_nacimiento: string;
  observaciones?: string;
  propietarioId: string;
  fincaId: string;
  castrado: boolean;
  esterelizado: boolean;

  nombre_padre?: string;
  arete_padre?: string;
  raza_padre?: string;
  nombre_criador_padre?: string;
  nombre_propietario_padre?: string;
  nombre_finca_origen_padre?: string;
  compra_padre?: boolean;
  nombre_criador_origen_padre?: string;

  nombre_madre?: string;
  arete_madre?: string;
  raza_madre?: string;
  nombre_criador_madre?: string;
  nombre_propietario_madre?: string;
  nombre_finca_origen_madre?: string;
  numero_parto_madre?: number;
  compra_madre?: boolean;
  nombre_criador_origen_madre?: string;
}

export interface TipoAlimentacion {
  alimento: string;
  origen: string;
}

export interface TipoComplemento {
  complemento: string;
}
