import { useQuery } from "@tanstack/react-query";

import api from "@/configs/api";

export type TGetAllUsersResponse = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export const GET_ALL_USERS_QUERY_KEY = ["getAllUsersQuery"];

export const getAllUsersAction = async (): Promise<TGetAllUsersResponse[]> => {
  const { data } = await api.get("/users");
  return data;
};

export const useGetAllUsers = () => {
  return useQuery<any, any, TGetAllUsersResponse[]>({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllUsersAction,
    staleTime: 60 * 1000,
  });
};
