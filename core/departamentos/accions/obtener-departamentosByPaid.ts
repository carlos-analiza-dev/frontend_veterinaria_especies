import { veterinariaAPI } from "@/core/api/veterinariaApi";
import {
  Departamento,
  ResponseDeptos,
} from "../interfaces/response-departamentos.interface";

export const obtenerDeptosPaisById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/departamentos-pais/departamenos/${id}`;

  const response = await veterinariaAPI.get<ResponseDeptos>(url);
  return response;
};

export const obtenerDeptosActivosPaisById = async (id: string) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/departamentos-pais/departamenos/activos/${id}`;

  const response = await veterinariaAPI.get<Departamento[]>(url);
  return response;
};
