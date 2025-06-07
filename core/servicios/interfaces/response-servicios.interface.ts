export interface ResponseServicios {
  servicios: Servicio[];
  total: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
  preciosPorPais: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  cantidadMin: number;
  cantidadMax: number;
  tiempo: string;
}
