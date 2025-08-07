export interface ResponseProdDisponiblesInterface {
  productos: ProductoElement[];
}

export interface ProductoElement {
  id: string;
  cantidadDisponible: number;
  stockMinimo: number;
  producto: ProductoProducto;
}

export interface ProductoProducto {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  precio: string;
  unidadMedida: string;
  esInsumo: boolean;
  disponible: boolean;
}
