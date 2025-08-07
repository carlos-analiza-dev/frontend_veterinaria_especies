export interface ResponseInsumosDisponibles {
  insumos: Insumo[];
}

export interface Insumo {
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
