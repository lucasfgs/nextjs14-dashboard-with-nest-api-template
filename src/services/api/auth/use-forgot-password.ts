import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

type ForgotPassword = {
  email: string;
};

const FORGOT_PASSWORD_MUTATION_KEY = ["forgotPasswordMutation"];

const forgotPassword = async (
  forgotPasswordData: ForgotPassword
): Promise<void> => {
  await api.post("/password/forgot", forgotPasswordData);
};

export const useForgotPassword = () => {
  return useMutation<void, AxiosError, ForgotPassword>({
    mutationFn: forgotPassword,
    mutationKey: FORGOT_PASSWORD_MUTATION_KEY,
    onError: (error) => {
      if (error.status === 401) {
        toast.error("Invalid email");
      }
    },
  });
};
