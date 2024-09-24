import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import api from "@/configs/api";

type TCreateCheckoutSession = {
  id: string;
};

type TCreateCheckoutSessionResponse = {
  url: string;
};

const CREATE_CHECKOUT_SESSION_MUTATION_KEY = ["createCheckoutSessionMutation"];

const createCheckoutSessionAction = async (
  createCheckoutSessionData: TCreateCheckoutSession
): Promise<TCreateCheckoutSessionResponse> => {
  const { data } = await api.post(
    `/payments/stripe/customers/${createCheckoutSessionData.id}/checkoutSession`
  );
  return data;
};

export const useCreateCheckoutSession = () => {
  return useMutation<
    TCreateCheckoutSessionResponse,
    AxiosError,
    TCreateCheckoutSession
  >({
    mutationFn: createCheckoutSessionAction,
    mutationKey: CREATE_CHECKOUT_SESSION_MUTATION_KEY,
    onError: (error) => {
      switch (error.status) {
        default:
          toast.error("Failed to create session");
          break;
      }
    },
    onSuccess: (data) => {
      window.open(data.url)?.focus();
    },
  });
};
