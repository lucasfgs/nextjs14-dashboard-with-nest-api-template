"use server";

import api from "@/configs/api";

import { TGetAllRolesResponse } from "../useGetAllRoles";

export const getAllRolesAction = async (): Promise<TGetAllRolesResponse[]> => {
  const { data } = await api.get("/roles");
  return data;
};
