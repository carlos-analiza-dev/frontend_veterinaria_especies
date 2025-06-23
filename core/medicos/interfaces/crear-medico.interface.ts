export interface CrearMedicoInterface {
  numero_colegiado: string;
  especialidad: string;
  universidad_formacion: string;
  anios_experiencia: number;
  areas_trabajo: string[];
  usuarioId: string;
  isActive?: boolean;
}
