export interface ResponseServicios {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
  subServicios: SubServicio[];
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
  pais: Pais;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
  departamentos: Departamento[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}
