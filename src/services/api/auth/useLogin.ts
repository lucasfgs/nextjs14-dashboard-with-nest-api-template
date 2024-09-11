import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/configs/api";
import useTokens from "@/utils/hooks/useTokens";

type Login = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

const LOGIN_USER_MUTATION_KEY = ["loginUserMutation"];

const login = async (loginData: Login): Promise<LoginResponse> => {
  const { data } = await api.post("/auth/login", loginData);
  return data;
};

export const useLogin = () => {
  const { setAccessToken } = useTokens();
  const router = useRouter();

  return useMutation<LoginResponse, AxiosError, Login>({
    mutationFn: login,
    mutationKey: LOGIN_USER_MUTATION_KEY,
    onError: (error) => {
      if (error.status === 401) {
        toast.error("Invalid email or password");
      }
    },
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      setAccessToken(data.access_token);
      router.push("/dashboard");
    },
  });
};
