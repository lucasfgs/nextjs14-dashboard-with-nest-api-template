import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/configs/api";

export type TLoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
};

type LoginPayload = {
  email: string;
  password: string;
};

const LOGIN_USER_MUTATION_KEY = ["loginUserMutation"];

const loginAction = async (
  loginData: LoginPayload
): Promise<TLoginResponse> => {
  const { data } = await api.post<TLoginResponse>("/auth/login", loginData);
  return data;
};

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<TLoginResponse, AxiosError, LoginPayload>({
    mutationKey: LOGIN_USER_MUTATION_KEY,
    mutationFn: loginAction,

    onError: (error) => {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("An unexpected error occurred");
      }
    },

    onSuccess: (data) => {
      queryClient.clear();
      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    },
  });
}
