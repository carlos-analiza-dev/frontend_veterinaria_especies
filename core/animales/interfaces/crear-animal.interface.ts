export interface CrearAnimalByFinca {
  especie: string;
  sexo: string;
  color: string;
  tipo_alimentacion: TipoAlimentacion[];
  identificador: string;
  raza: string;
  edad_promedio?: number;
  fecha_nacimiento: string;
  observaciones: string;
  propietarioId: string;
  fincaId: string;
  castrado: boolean;
  esterelizado: boolean;
}

export interface TipoAlimentacion {
  alimento: string;
}
