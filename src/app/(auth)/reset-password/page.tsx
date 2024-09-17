"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

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
import { useResetPassword } from "@/services/api/auth/useResetPassword";
import { useAuth } from "@/components/pages/auth/context";

const confirmForgotPasswordCodeSchema = z
  .object({
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

type FormSchema = z.infer<typeof confirmForgotPasswordCodeSchema>;

export default function Login() {
  const router = useRouter();

  const { email, confirmationCode } = useAuth();

  const { mutate: resetPassword, status } = useResetPassword();

  const form = useForm<FormSchema>({
    resolver: zodResolver(confirmForgotPasswordCodeSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!email || !confirmationCode) {
      toast.error("Session expired");
      router.push("/login");
    }
  }, [email, confirmationCode, router]);

  async function onSubmit(values: FormSchema) {
    if (!confirmationCode) {
      toast.error("Invalid confirmation code");
      return router.push("/login");
    }

    if (!email) {
      toast.error("Invalid email");
      return router.push("/login");
    }

    resetPassword({
      code: confirmationCode,
      email: email,
      password: values.password,
      passwordConfirmation: values.confirmPassword,
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="************"
                          type="password"
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          placeholder="************"
                          type="password"
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
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
