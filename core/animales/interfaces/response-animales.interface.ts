export interface ResponseAnimalesByPropietario {
  id: string;
  especie: string;
  sexo: string;
  color: string;
  identificador: string;
  raza: string;
  edad_promedio: string;
  fecha_nacimiento: string;
  observaciones: string;
  fecha_registro: string;
  finca: Finca;
  propietario: Propietario;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  abreviatura: string;
  tamaño_total: string;
  area_ganaderia: string;
  tipo_explotacion: string;
  especies_maneja: string[];
  fecha_registro: string;
  isActive: boolean;
}

export interface Propietario {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: string;
}
