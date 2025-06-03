export type UsersStackParamList = {
  users: undefined;
  UserDetails: { userId: string };
  CrearUsuario: undefined;
  PaisDetails: { paisId: string };
  PaisesPage: undefined;
  CrearPais: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends UsersStackParamList {}
  }
}
