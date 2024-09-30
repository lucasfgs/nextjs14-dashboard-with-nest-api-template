import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

import { GET_ALL_ROLES_QUERY_KEY } from "./use-get-all-roles";

type AddRoleBody = {
  name: string;
  description: string;
};

type AddRoleResponse = {};

const ADD_ROLE_MUTATION_KEY = ["addRoleMutation"];

const addRoleAction = async (
  addRoleData: AddRoleBody
): Promise<AddRoleResponse> => {
  const { data } = await api.post("/roles", addRoleData);
  return data;
};

export const useAddRole = () => {
  const queryClient = new QueryClient();

  return useMutation<AddRoleResponse, AxiosError, AddRoleBody>({
    mutationFn: addRoleAction,
    mutationKey: ADD_ROLE_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 409:
          toast.error("Role already exists");
          break;

        default:
          toast.error("Failed to add role");
          break;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GET_ALL_ROLES_QUERY_KEY });
    },
  });
};
