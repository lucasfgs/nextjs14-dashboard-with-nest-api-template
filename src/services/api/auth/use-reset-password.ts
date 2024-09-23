import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/configs/api";
import { useAuth } from "@/components/pages/auth/context";

type ResetPassword = {
  email: string;
  code: string;
  password: string;
  passwordConfirmation: string;
};

const RESET_PASSWORD_MUTATION_KEY = ["resetPasswordMutation"];

const resetPassword = async (resetPasswordData: ResetPassword) => {
  return await api.post("/password/reset", resetPasswordData);
};

export const useResetPassword = () => {
  const router = useRouter();

  const { setEmail, setConfirmationCode } = useAuth();

  return useMutation<AxiosResponse, AxiosError, ResetPassword>({
    mutationFn: resetPassword,
    mutationKey: RESET_PASSWORD_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 401:
          toast.error("Invalid code");
          break;
        case 410:
          toast.error("Code expired");
          break;

        default:
          toast.error("An error occurred while resetting the password");
          break;
      }
    },
    onSuccess: () => {
      setEmail(null);
      setConfirmationCode(null);
      router.push("/login");
    },
  });
};
