export interface ObtenerMedicosInterface {
  total: number;
  data: Medico[];
}

export interface Medico {
  id: string;
  numero_colegiado: string;
  especialidad: string;
  universidad_formacion: string;
  anios_experiencia: number;
  isActive: boolean;
  usuario: Usuario;
  areas_trabajo: AreasTrabajo[];
}

export interface AreasTrabajo {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
}

export interface Usuario {
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
