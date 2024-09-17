import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import api from "@/configs/api";
import { useAuth } from "@/components/pages/auth/context";

type RecoveryConfirmPasswordCode = {
  email: string;
  confirmationCode: string;
};

const CONFIRM_RECOVERY_PASSWORD_MUTATION_KEY = ["forgotPasswordMutation"];

const confirmRecoveryPasswordCode = async ({
  email,
  confirmationCode,
}: RecoveryConfirmPasswordCode) => {
  return await api.post("/password/code/verify", {
    email,
    code: confirmationCode,
  });
};

export const useConfirmRecoveryPasswordCode = () => {
  const router = useRouter();

  const { setEmail, setConfirmationCode } = useAuth();

  return useMutation<AxiosResponse, AxiosError, RecoveryConfirmPasswordCode>({
    mutationFn: confirmRecoveryPasswordCode,
    mutationKey: CONFIRM_RECOVERY_PASSWORD_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        case 401:
          toast.error("Invalid code");
          break;
        case 410:
          toast.error("Code expired");
          break;

        default:
          toast.error("An error occurred while verifying the code");
          break;
      }
    },
    onSuccess: (_, { email, confirmationCode }) => {
      setEmail(email);
      setConfirmationCode(confirmationCode);
      router.push(`reset-password`);
    },
  });
};
