export interface ObtenerProduccionByUserInterface {
  id: string;
  produccion_mixta: boolean;
  transformacion_artesanal: boolean;
  consumo_propio: boolean;
  produccion_venta: boolean;
  finca: Finca;
  propietario: Propietario;
  ganadera: Ganadera | null;
  agricola: Agricola | null;
  forrajesInsumo: ForrajesInsumo | null;
  alternativa: Alternativa | null;
  apicultura: Apicultura | null;
}

export interface Agricola {
  id: string;
  cultivos: Cultivo[];
}

export interface Cultivo {
  tipo: string;
  estacionalidad: string;
  metodo_cultivo?: string;
  meses_produccion: string[];
  tiempo_estimado_cultivo: string;
  area_cultivada_hectareas: number;
  cantidad_producida_hectareas: string;
}

export interface Alternativa {
  id: string;
  actividades: Actividade[];
}

export interface Actividade {
  tipo: string;
  unidad_medida?: string;
  ingresos_anuales: number;
  cantidad_producida: string;
  descripcion?: string;
}

export interface Apicultura {
  id: string;
  numero_colmenas: number;
  frecuencia_cosecha: string;
  cantidad_por_cosecha: string;
  calidad_miel: string;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total_hectarea: string;
  area_ganaderia_hectarea: string;
  tipo_explotacion: TipoExplotacion[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}

export interface ForrajesInsumo {
  id: string;
  insumos: Insumo[];
}

export interface Insumo {
  tipo: string;
  tipo_heno?: string;
  estacionalidad_heno?: string;
  meses_produccion_heno?: string[];
  produccion_manzana?: string;
  tiempo_estimado_cultivo?: string;
}

export interface Ganadera {
  id: string;
  tiposProduccion: string[];
  produccionLecheCantidad: string;
  produccionLecheUnidad: string;
  vacasOrdeño: number;
  vacasSecas: number;
  terneros: number;
  fechaPromedioSecado: Date;
  cabezasEngordeBovino: number | null;
  kilosSacrificioBovino: null | string;
  cerdosEngorde: number | null;
  pesoPromedioCerdo: number | null;
  mortalidadLoteAves: number | null;
  huevosPorDia: number | null;
  gallinasPonedoras: number | null;
  calidadHuevo: string | null;
  animalesEngordeCaprino: number | null;
  pesoPromedioCaprino: number | null;
  edadSacrificioCaprino: number | null;
  animalesDisponibles: number | null;
  pesoPromedioCabeza: number | null;
  otroProductoNombre: null | string;
  otroProductoUnidadMedida: null | string;
  otroProductoProduccionMensual: null | string;
}

export interface Propietario {
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
  role: Role;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: any[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
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
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
