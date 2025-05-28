import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import api from "@/configs/api";

const LOGOUT_USER_MUTATION_KEY = ["logoutUserMutation"];

const logoutAction = async (): Promise<void> => {
  const { data } = await api.post<void>("/auth/logout");
  return data;
};

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, void>({
    mutationKey: LOGOUT_USER_MUTATION_KEY,
    mutationFn: logoutAction,

    onSuccess: (data) => {
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
}
