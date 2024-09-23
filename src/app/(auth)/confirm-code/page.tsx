"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPassword } from "@/services/api/auth/use-forgot-password";
import {
  InputOTPSeparator,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useConfirmRecoveryPasswordCode } from "@/services/api/auth/use-confirm-recovery-password-code";

const formSchema = z.object({
  confirmationCode: z.string().min(6),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { mutate: forgotPassword, status: forgotPasswordStatus } =
    useForgotPassword();
  const {
    mutate: confirmRecoveryPasswordCode,
    status: recoveryPasswordCodeStatus,
  } = useConfirmRecoveryPasswordCode();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    const email = searchParams.get("email");

    if (!email) {
      toast.error("Email not found");
      return router.push("/login");
    }

    confirmRecoveryPasswordCode({
      email,
      confirmationCode: values.confirmationCode,
    });
  }

  async function resendCode() {
    const email = searchParams.get("email");

    if (!email) {
      toast.error("Email not found");
      return router.push("/login");
    }

    forgotPassword({
      email,
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Confirm</h1>
        <p className="text-sm text-muted-foreground">
          Enter the code sent to your email
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmationCode">
                        Password Recovery Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP
                          id="confirmationCode"
                          maxLength={6}
                          disabled={recoveryPasswordCodeStatus === "pending"}
                          {...field}
                        >
                          <InputOTPGroup className="flex 1">
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={recoveryPasswordCodeStatus === "pending"}>
                {recoveryPasswordCodeStatus === "pending" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="flex flex-col text-center text-sm text-muted-foreground">
        Code not found or invalid?{" "}
        <Button
          variant={"secondary"}
          size={"sm"}
          className="mt-2"
          onClick={() => resendCode()}
        >
          {forgotPasswordStatus === "pending" && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Resend
        </Button>
      </div>
    </div>
  );
}
