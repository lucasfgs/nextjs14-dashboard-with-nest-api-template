"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForgotPassword } from "@/services/api/auth/use-forgot-password";

const forgotPasswodFormSchema = z.object({
  email: z.string().email(),
});

const confirmForgotPasswordCodeSchema = z
  .object({
    confirmationCode: z.string().min(6),
    password: z
      .string()
      .min(8)
      .regex(new RegExp(/(?=.*?[A-Z])/), "At least one uppercase letter")
      .regex(new RegExp(/(?=.*?[a-z])/), "At least one lowercase letter")
      .regex(new RegExp(/(?=.*?[0-9])/), "At least one number")
      .regex(
        new RegExp(/(?=.*?[#?!@$%^&*-.])/),
        "At least one special character"
      ),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormSchema = z.infer<typeof forgotPasswodFormSchema>;
type ConfirmForgotPasswordCodeSchema = z.infer<
  typeof confirmForgotPasswordCodeSchema
>;

export default function Login() {
  const router = useRouter();
  const { mutate: forgotPassword, status } = useForgotPassword();

  const forgotPasswordForm = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswodFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function resetPassword(values: ForgotPasswordFormSchema) {
    forgotPassword({
      email: values.email,
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter the email address associated with your account
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...forgotPasswordForm}>
          <form onSubmit={forgotPasswordForm.handleSubmit(resetPassword)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={forgotPasswordForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          disabled={status === "pending"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button disabled={status === "pending"}>
                {status === "pending" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
