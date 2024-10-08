import { useQuery } from "@tanstack/react-query";

import api from "@/configs/api";

export type TGetAllPermissionsResponse = {
  id: number;
  name: string;
  description: string;
};

export const GET_ALL_PERMISSIONS_QUERY = ["getAllPermissionsQuery"];

export const getAllPermissionsAction = async (): Promise<
  TGetAllPermissionsResponse[]
> => {
  const { data } = await api.get("/permissions");
  return data;
};

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: GET_ALL_PERMISSIONS_QUERY,
    queryFn: getAllPermissionsAction,
  });
};
