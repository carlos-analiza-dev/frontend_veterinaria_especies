export interface ResponseInterfaceAnalisisSuelo {
  data: Analisis[];
  total: number;
}

export interface Analisis {
  id: string;
  fechaAnalisis: string;
  calidadSuelo: string;
  tipoSuelo: string;
  rendimiento: string;
  eficienciaInsumos: string;
  phSuelo: null | string;
  materiaOrganica: null | string;
  observaciones: null | string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface User {
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
