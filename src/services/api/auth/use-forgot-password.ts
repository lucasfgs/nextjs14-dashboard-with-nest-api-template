import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import api from "@/configs/api";
import { createQueryString as createQueryStringRaw } from "@/utils/createQueryString";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(createQueryStringRaw, [searchParams]);

  return useMutation<void, AxiosError, ForgotPassword>({
    mutationFn: forgotPassword,
    mutationKey: FORGOT_PASSWORD_MUTATION_KEY,
    onError: (error) => {
      if (error.status === 401) {
        toast.error("Invalid email");
      }
    },
    onSuccess: (_, { email }) => {
      router.push(
        `confirm-code?${createQueryString("email", email, searchParams)}`
      );
    },
  });
};
