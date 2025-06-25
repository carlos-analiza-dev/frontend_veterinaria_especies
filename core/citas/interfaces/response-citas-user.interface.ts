export interface ResponseCitasInterface {
  total: number;
  citas: Cita[];
}

export interface Cita {
  id: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  cantidadAnimales: number;
  totalPagar: string;
  duracion: number;
  estado: string;
  medico: Medico;
  animal: Animal;
  finca: Finca;
  subServicio: SubServicio;
}

export interface Animal {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  edad_promedio: string;
  fecha_nacimiento: Date;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  especie: Especie;
  raza: Especie;
  propietario: Ario;
  finca: Finca;
}

export interface Especie {
  id: string;
  nombre: string;
  isActive: boolean;
  abreviatura?: string;
  descripcion?: string;
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

export interface Ario {
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

export interface Medico {
  id: string;
  numero_colegiado: string;
  especialidad: string;
  universidad_formacion: string;
  anios_experiencia: number;
  isActive: boolean;
  areas_trabajo: Especie[];
  usuario: Ario;
  horarios: Horario[];
}

export interface Horario {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface SubServicio {
  id: string;
  nombre: string;
  descripcion: string;
  servicioId: string;
  isActive: boolean;
  preciosPorPais: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  tiempo: number;
}
