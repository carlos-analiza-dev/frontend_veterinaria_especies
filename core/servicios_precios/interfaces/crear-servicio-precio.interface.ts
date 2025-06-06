export interface CrearServicePrecio {
  servicioId: string;
  paisId: string;
  precio: number;
  cantidadMin: number;
  cantidadMax: number;
  tiempo: number;
}

export interface ServicioPrecio extends CrearServicePrecio {
  id: string;
  pais: {
    id: string;
    nombre: string;
    simbolo_moneda: string;
  };
}

export interface PaisOption {
  value: string;
  label: string;
}
