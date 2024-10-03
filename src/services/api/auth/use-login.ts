import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/configs/api";
import useTokens from "@/utils/hooks/useTokens";

type Login = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
};

const LOGIN_USER_MUTATION_KEY = ["loginUserMutation"];

const login = async (loginData: Login): Promise<TLoginResponse> => {
  const { data } = await axios.post(`/api/auth/login`, loginData);
  return data;
};

export const useLogin = () => {
  const { setAccessToken, setRefreshToken } = useTokens();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<TLoginResponse, AxiosError, Login>({
    mutationFn: login,
    mutationKey: LOGIN_USER_MUTATION_KEY,
    onError: (error) => {
      if (error.status === 401) {
        toast.error("Invalid email or password");
      }
    },
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      // setAccessToken(data.accessToken);
      // setRefreshToken(data.refreshToken);
      api.defaults.headers.Authorization = "Bearer " + data.accessToken;

      queryClient.clear();
      router.push("/dashboard");
    },
  });
};
