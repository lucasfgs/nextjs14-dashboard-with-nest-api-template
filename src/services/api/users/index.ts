import { useQueryClient } from "@tanstack/react-query";

import { addUserMutation } from "./addUser";
import { getAllUsersQuery } from "./getAllUsers";

export const useUsers = () => {
  const queryClient = useQueryClient();

  const addUser = addUserMutation(queryClient);

  const getAllUsers = getAllUsersQuery();

  return {
    addUser,
    getAllUsers,
  };
};
