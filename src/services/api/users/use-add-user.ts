import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

import { GET_ALL_USERS_QUERY_KEY } from "./use-get-all-users";

type AddUserBody = {
  name: string;
  email: string;
  password: string;
  roleId: number;
};

type AddUserResponse = {};

const ADD_USER_MUTATION_KEY = ["addUserMutation"];

const addUserAction = async (
  addUserData: AddUserBody
): Promise<AddUserResponse> => {
  const { data } = await api.post("/users", addUserData);
  return data;
};

export const useAddUser = () => {
  const queryClient = new QueryClient();

  return useMutation<AddUserResponse, AxiosError, AddUserBody>({
    mutationFn: addUserAction,
    mutationKey: ADD_USER_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 409:
          toast.error("Email already in use");
          break;

        default:
          toast.error("Failed to add user");
          break;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GET_ALL_USERS_QUERY_KEY });
    },
  });
};
