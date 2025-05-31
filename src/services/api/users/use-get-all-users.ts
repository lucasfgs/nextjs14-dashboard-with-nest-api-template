import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import api, { ApiResponse } from "@/configs/api";
import { TPaginationParams } from "@/types/api";
import {
  createPaginationQueryKey,
  createPaginationUrl,
} from "@/utils/pagination";

export type TUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type TGetAllUsersResponse = ApiResponse<TUser[]>;

export const GET_ALL_USERS_QUERY_KEY = ["users", "list"] as const;

export const getAllUsersAction = async (
  params: TPaginationParams
): Promise<TGetAllUsersResponse> => {
  const url = createPaginationUrl("/users", params);
  const response = await api.get<TUser[]>(url);
  return response;
};

export const useGetAllUsers = (
  params: TPaginationParams = {},
  options?: UseQueryOptions<TGetAllUsersResponse>
) => {
  const queryKey = createPaginationQueryKey(GET_ALL_USERS_QUERY_KEY, params);

  return useQuery<TGetAllUsersResponse>({
    queryKey,
    queryFn: () => getAllUsersAction(params),
    ...options,
  });
};
