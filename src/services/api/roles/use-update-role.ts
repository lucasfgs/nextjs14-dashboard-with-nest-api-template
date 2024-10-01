import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

type UpdateRoleBody = {
  name: string;
  description: string;
};

type UpdateRoleResponse = {};

const UPDATE_ROLE_MUTATION_KEY = ["updateRoleMutation"];

const updateRoleAction = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateRoleBody;
}): Promise<UpdateRoleResponse> => {
  const { data } = await api.patch(`/roles/${id}`, payload);
  return data;
};

export const useUpdateRole = () => {
  const queryClient = new QueryClient();

  return useMutation<
    UpdateRoleResponse,
    AxiosError,
    { id: number; payload: UpdateRoleBody }
  >({
    mutationFn: updateRoleAction,
    mutationKey: UPDATE_ROLE_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 409:
          toast.error("Role already exists");
          break;

        default:
          toast.error("Failed to update role");
          break;
      }
    },
    onSuccess: (data) => {
      queryClient.clear();
      toast.success("Role updated successfully");
    },
  });
};
