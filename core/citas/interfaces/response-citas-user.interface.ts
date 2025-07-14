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
  distancia?: number;
  tiempoViaje?: string;
}

export interface Animal {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  tipo_reproduccion: string;
  pureza: string;
  edad_promedio: number;
  fecha_nacimiento: Date;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: Complemento[];
  medicamento: string;
  nombre_padre: string;
  arete_padre: null | string;
  nombre_criador_padre: null | string;
  nombre_propietario_padre: null | string;
  nombre_finca_origen_padre: string;
  compra_padre: boolean;
  nombre_criador_origen_padre: string;
  nombre_madre: string;
  arete_madre: null | string;
  nombre_criador_madre: null | string;
  nombre_propietario_madre: null | string;
  nombre_finca_origen_madre: string;
  numero_parto_madre: number;
  compra_madre: boolean;
  nombre_criador_origen_madre: string;
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  especie: EspecieClass;
  razas: EspecieClass[];
  razas_padre: EspecieClass[];
  razas_madre: EspecieClass[];
  propietario: Ario;
  finca: Finca;
}

export interface Complemento {
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

export interface Ario {
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

export interface Medico {
  id: string;
  numero_colegiado: string;
  especialidad: string;
  universidad_formacion: string;
  anios_experiencia: number;
  isActive: boolean;
  areas_trabajo: SubServicio[];
  usuario: Ario;
  horarios: Horario[];
}

export interface SubServicio {
  id: string;
  nombre: string;
  descripcion: string;
  servicioId: string;
  isActive: boolean;
  preciosPorPais?: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  tiempo: number;
}

export interface Horario {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}
