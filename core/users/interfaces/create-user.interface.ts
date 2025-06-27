export interface CrearUsuario {
  email: string;
  password: string;
  name: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  sexo: string;
  role?: string;
  pais: string;
  departamento: string;
  municipio: string;
}
