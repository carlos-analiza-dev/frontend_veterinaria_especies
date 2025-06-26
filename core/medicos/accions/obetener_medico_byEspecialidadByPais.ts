import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { Medico } from "../interfaces/obtener-medicos.interface";

export const ObtenerMedicoByEspecialidadesByPais = async (
  paisId: string,
  especialidadId: string
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/medicos/especialidad/${paisId}/${especialidadId}`;
  const response = await veterinariaAPI.get<Medico[]>(url);
  return response.data;
};
