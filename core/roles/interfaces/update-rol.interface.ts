import { CreateRolI } from "./crear-rol.interface";

export interface UpdateRolI extends Partial<CreateRolI> {
  id: string;
}
