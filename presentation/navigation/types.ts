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
  AgregarPreciosServices: { servicioId: string };
  RolesPage: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UsersStackParamList {}
  }
}
