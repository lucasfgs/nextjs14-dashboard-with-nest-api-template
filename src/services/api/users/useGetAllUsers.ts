import { useQuery } from "@tanstack/react-query";

import api from "@/configs/api";

type User = {
  email: string;
  password: string;
};

export type TGetAllUsersResponse = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

const GET_ALL_USERS_QUERY_KEY = ["getAllUsersQuery"];

const getAllusers = async (): Promise<TGetAllUsersResponse[]> => {
  const { data } = await api.get("/users");
  return data;
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllusers,
  });
};
