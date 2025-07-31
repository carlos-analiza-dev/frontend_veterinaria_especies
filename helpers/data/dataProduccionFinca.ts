import { TipoProduccionGanadera } from "@/core/produccion/interface/crear-produccion-finca.interface";

export const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const tiposProduccion = Object.values(TipoProduccionGanadera);
export const tiposCultivo = [
  "Maíz",
  "Frijol",
  "Arroz",
  "Sorgo",
  "Café",
  "Papa",
  "Tomate",
  "Cebolla",
  "Ajo",
  "Yuca",
  "Hortalizas",
  "Frutas",
  "Otros",
];

export const metodosCultivo = ["Tradicional", "Orgánico", "Invernadero"];

export const tiposInsumo = [
  "Heno",
  "Silo",
  "Pasto",
  "Harina",
  "Alimentos Concentrados elaborados",
  "Otros",
];

export const tiposHeno = [
  "Bermuda",
  "Alfalfa",
  "Pasto Estrella",
  "Avena",
  "Ryegrass",
  "Maíz",
  "Sorgo Forrajero",
  "Pangola",
  "Pasto guinea",
  "Otro",
];

export const calidadesMiel = ["Oscura", "Clara", "Multifloral"];

export const unidadLeche = ["Litros", "Libras", "Botellas"];
