export interface ResponseCitasPendientesMedicosInterface {
  total: number;
  citas: Cita[];
}

export interface Cita {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  estado: string;
  totalPagar: string;
  totalFinal: string;
  cantidadAnimales: number;
  medico: Medico;
  animales: Animale[];
  finca: Finca;
  subServicio: SubServicio;
  distancia?: number;
  tiempoViaje?: string;
}

export interface Animale {
  id: string;
  identificador: string;
  especie: string;
  razas: string[];
  propietario: Propietario;
}

export interface Propietario {
  name: string;
  telefono: string;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
}

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
  telefono: string;
}

export interface SubServicio {
  id: string;
  nombre: string;
  descripcion: string;
}
