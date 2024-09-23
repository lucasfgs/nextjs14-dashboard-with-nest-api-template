import { useQuery, QueryOptions } from "@tanstack/react-query";

import { getAllUsersAction } from "./actions/getAllUsers";

export type TGetAllUsersResponse = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export const GET_ALL_USERS_QUERY_KEY = ["getAllUsersQuery"];

const getAllUsers = async (): Promise<TGetAllUsersResponse[]> => {
  return await getAllUsersAction();
};

export const useGetAllUsers = (options: QueryOptions | null = null) => {
  return useQuery<any, any, TGetAllUsersResponse[]>({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllUsers,
    ...options,
  });
};
