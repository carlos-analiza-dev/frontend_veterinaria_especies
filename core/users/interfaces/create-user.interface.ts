export interface CrearUsuario {
  email: string;
  password: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  rol?: string;
  pais: string;
  departamento: string;
  municipio: string;
}
