export interface CrearAnalisisInterface {
  fechaAnalisis: string;
  calidadSuelo: string;
  tipoSuelo: string;
  rendimiento: number;
  eficienciaInsumos: number;
  phSuelo?: number;
  materiaOrganica?: number;
  observaciones?: string;
  userId: string;
}
