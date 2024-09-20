"use server";

import api from "@/configs/api";

import { TGetAllUsersResponse } from "../useGetAllUsers";

export const getAllUsersAction = async (): Promise<TGetAllUsersResponse[]> => {
  const { data } = await api.get("/users");
  return data;
};
