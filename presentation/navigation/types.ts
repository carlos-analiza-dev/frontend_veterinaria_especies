export type UsersStackParamList = {
  users: undefined;
  UserDetails: { userId: string };
  CrearUsuario: undefined;
  PaisDetails: { paisId: string };
  AgregarDeptoPais: { paisId: string };
  PaisesPage: undefined;
  CrearPais: undefined;
  PerfilAdmin: undefined;
  ServiciosAdmin: undefined;
  CrearServicio: undefined;
  DetailsServicio: { servicioId: string };
  AgregarSubServicio: { servicioId: string; nombre: string };
  AgregarPreciosServices: { servicioId: string };
  RolesPage: undefined;
  CitasPage: undefined;
  FincasPage: undefined;
  AnimalesPage: undefined;
  CrearFincaPage: undefined;
  ProfileGanadero: undefined;
  CrearAnimal: undefined;
  FincaDetailsPage: { fincaId: string };
  AnimalDetails: { animalId: string };
  MedicosPage: undefined;
  CrearMedicoPage: undefined;
  DetailsMedico: { medicoId: string };
  CrearCita: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UsersStackParamList {}
  }
}
