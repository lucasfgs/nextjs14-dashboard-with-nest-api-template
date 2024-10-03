import { useQuery } from "@tanstack/react-query";

import api from "@/configs/api";

export type TGetRoleResponse = {
  id: string;
  name: string;
  description: string;
  permissions: {
    id: number;
    name: string;
    description: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  }[];
};

export const GET_ROLE_QUERY_KEY = "getRoleQuery";

export const getRoleAction = async (
  roleId?: number
): Promise<TGetRoleResponse | null> => {
  if (!roleId) return null;
  const { data } = await api.get(`/roles/${roleId}`);
  return data;
};

export const useGetRole = (roleId?: number) => {
  return useQuery({
    queryKey: [GET_ROLE_QUERY_KEY, String(roleId)],
    queryFn: () => getRoleAction(roleId),
    staleTime: 1000 * 60 * 60,
  });
};
