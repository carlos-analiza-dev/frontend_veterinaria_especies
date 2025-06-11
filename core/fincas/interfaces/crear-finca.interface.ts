export interface CrearFinca {
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  abreviatura: string;
  departamentoId: string;
  municipioId: string;
  tamaño_total: string;
  area_ganaderia: string;
  tipo_explotacion: string;
  especies_maneja: { especie: string; cantidad: number }[];
  propietario_id: string;
  pais_id: string;
}
