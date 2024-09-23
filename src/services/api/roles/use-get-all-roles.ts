import { useQuery } from "@tanstack/react-query";

import api from "@/configs/api";

export type TGetAllRolesResponse = {
  id: string;
  name: string;
};

const GET_ALL_ROLES_QUERY_KEY = ["getAllRolesQuery"];

const getAllRolesAction = async (): Promise<TGetAllRolesResponse[]> => {
  const { data } = await api.get("/roles");
  return data;
};

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: GET_ALL_ROLES_QUERY_KEY,
    queryFn: getAllRolesAction,
  });
};
