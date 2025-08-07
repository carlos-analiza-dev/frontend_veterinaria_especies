export interface ResponseProductosDisponibles {
  productos: Producto[];
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: string;
  unidadMedida: string;
  esInsumo: boolean;
  disponible: boolean;
  inventario: Inventario;
}

export interface Inventario {
  id: string;
  cantidadDisponible: number;
  stockMinimo: number;
}
