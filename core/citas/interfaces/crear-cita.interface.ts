export interface CrearCitaInterface {
  medicoId: string;
  animalesId: string[];
  fincaId: string;
  subServicioId: string;
  usuarioId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  cantidadAnimales?: number;
  totalPagar: number;
  estado?: string;
}
