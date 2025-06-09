import { veterinariaAPI } from "@/core/api/veterinariaApi";
import { ResponseRolesFilter } from "../interfaces/response-roles-filters.interface";
import { ResponseRoles } from "../interfaces/response-roles.interface";

export const getRoles = async () => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/roles`;

  const response = await veterinariaAPI.get<ResponseRoles[]>(url);
  return response;
};

export const getRolesFilters = async (
  limit: number = 10,
  offset: number = 0
) => {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/roles/filters?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseRolesFilter>(url);
  return response;
};
