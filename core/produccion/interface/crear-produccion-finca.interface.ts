export enum TipoProduccionGanadera {
  LECHE = "Leche",
  CARNE_BOVINA = "Carne Bovina",
  CARNE_PORCINA = "Carne Porcina",
  CARNE_AVE = "Carne de Ave",
  HUEVO = "Huevo",
  CARNE_CAPRINO = "Carne Caprino",
  GANADO_PIE = "Ganado en pie",
  OTRO = "Otro",
}
export enum UnidadProduccionLeche {
  LITROS = "Litros",
  LIBRAS = "Libras",
  BOTELLAS = "Botellas",
}

export enum CalidadHuevo {
  A = "A",
  AA = "AA",
  SUCIO = "Sucio",
}
export type CultivoTipo =
  | "Maíz"
  | "Frijol"
  | "Arroz"
  | "Sorgo"
  | "Café"
  | "Papa"
  | "Tomate"
  | "Cebolla"
  | "Ajo"
  | "Yuca"
  | "Hortalizas"
  | "Frutas"
  | "Otros";

export type Estacionalidad = "Anual" | "Estacional" | "Continuo";
export type MetodoCultivo = "Tradicional" | "Orgánico" | "Invernadero";

export type InsumoTipo =
  | "Heno"
  | "Silo"
  | "Pasto"
  | "Harina"
  | "Alimentos Concentrados elaborados"
  | "Otros";

export interface ProduccionGanadera {
  tiposProduccion: TipoProduccionGanadera[];

  produccionLecheCantidad?: number;
  produccionLecheUnidad?: UnidadProduccionLeche;
  vacasOrdeño?: number;
  vacasSecas?: number;
  terneros?: number;
  fechaPromedioSecado?: string;

  cabezasEngordeBovino?: number;
  kilosSacrificioBovino?: number;

  cerdosEngorde?: number;
  pesoPromedioCerdo?: number;
  edadSacrificioProcino?: string;

  mortalidadLoteAves?: number;

  huevosPorDia?: number;
  gallinasPonedoras?: number;
  calidadHuevo?: CalidadHuevo;

  animalesEngordeCaprino?: number;
  pesoPromedioCaprino?: number;
  edadSacrificioCaprino?: string;

  animalesDisponibles?: number;
  pesoPromedioCabeza?: number;

  otroProductoNombre?: string;
  otroProductoUnidadMedida?: string;
  otroProductoProduccionMensual?: number;
}

export interface Cultivo {
  tipo: CultivoTipo;
  descripcion?: string;
  estacionalidad: Estacionalidad;
  tiempo_estimado_cultivo: string;
  meses_produccion: string[];
  cantidad_producida_hectareas: string;
}

export interface ProduccionAgricola {
  cultivos: Cultivo[];
}

export interface ProduccionApicultura {
  numero_colmenas: number;
  frecuencia_cosecha: string;
  cantidad_por_cosecha: number;
  calidad_miel: "Oscura" | "Clara" | "Multifloral";
}

export interface InsumoForraje {
  tipo: InsumoTipo;
  tipo_heno?: string;
  estacionalidad_heno?: string;
  meses_produccion_heno?: string[];
  tiempo_estimado_cultivo?: string;
  produccion_manzana?: string;
  descripcion_otro?: string;
}

export interface ProduccionForrajesInsumo {
  insumos: InsumoForraje[];
}

export interface ActividadAlternativa {
  tipo?: string;
  cantidad_producida?: string;
  unidad_medida?: string;
  ingresos_anuales?: number;
}

export interface ProduccionAlternativa {
  actividades: ActividadAlternativa[];
}

export interface CreateProduccionFinca {
  fincaId: string;
  userId: string;

  ganadera?: ProduccionGanadera;
  agricola?: ProduccionAgricola;
  apicultura?: ProduccionApicultura;
  forrajesInsumo?: ProduccionForrajesInsumo;
  alternativa?: ProduccionAlternativa;

  produccion_mixta?: boolean;
  transformacion_artesanal?: boolean;
  consumo_propio?: boolean;
  produccion_venta?: boolean;
}
