import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

type Login = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

const LOGIN_USER_MUTATION_KEY = ["loginUserMutation"];

const login = async (loginData: Login): Promise<LoginResponse> => {
  console.log("login: ", loginData);
  const { data } = await api.post("/auth/login", loginData);
  return data;
};

export const useLogin = () => {
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
      console.log("Logged in: ", data);
    },
  });
};
