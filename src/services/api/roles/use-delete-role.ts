import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

import { GET_ALL_ROLES_QUERY_KEY } from "./use-get-all-roles";

type DeleteRoleResponse = {};

const DELETE_ROLE_MUTATION_KEY = ["deleteRoleMutation"];

const deleteRoleAction = async (id: number): Promise<DeleteRoleResponse> => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteRoleResponse, AxiosError, number>({
    mutationFn: deleteRoleAction,
    mutationKey: DELETE_ROLE_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 409:
          toast.error("Role already exists");
          break;

        case 500:
          toast.error("Role is in use");
          break;

        default:
          toast.error("Failed to delete role");
          break;
      }
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: GET_ALL_ROLES_QUERY_KEY,
      });
      toast.success("Role deleted successfully");
    },
  });
};
