import { useQuery } from "@tanstack/react-query";

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

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllUsers,
  });
};
