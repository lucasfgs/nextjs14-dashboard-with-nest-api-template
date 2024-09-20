import { useQuery } from "@tanstack/react-query";

import { getAllRolesAction } from "./actions/getAllRoles";

export type TGetAllRolesResponse = {
  id: string;
  name: string;
};

const GET_ALL_ROLES_QUERY_KEY = ["getAllRolesQuery"];

const getAllRoles = async (): Promise<TGetAllRolesResponse[]> => {
  return await getAllRolesAction();
};

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: GET_ALL_ROLES_QUERY_KEY,
    queryFn: getAllRoles,
  });
};
