"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import "@aws-amplify/ui-react/styles.css";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Icons } from "@/components/ui/icons";
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
import { useLogin } from "@/services/api/auth/useLogin";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Login() {
  const router = useRouter();

  const { mutate: login, data, error, status } = useLogin();

  useEffect(() => {
    console.log("status: ", status);
  }, [status]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormSchema) {
    login({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to access our platform
        </p>
      </div>
      <div className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="name@example.com"
                          type="email"
                          autoCapitalize="none"
                          autoComplete="email"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>

                        <Link
                          href={"/forgot-password"}
                          className="underline-offset-4 text-primary hover:opacity-70 hover:underline text-sm"
                        >
                          Forgot password?
                        </Link>
                      </div>

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
              </div>
              <Button disabled={status === "pending"}>
                {status === "pending" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign In with Email
              </Button>
            </div>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" type="button" disabled={status === "pending"}>
          {status === "pending" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.facebook className="mr-2 h-4 w-4" />
          )}{" "}
          Facebook
        </Button>
        <Button variant="outline" type="button" disabled={status === "pending"}>
          {status === "pending" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>

      <span className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={"/register"}
          className={
            "underline-offset-4 text-primary hover:opacity-70 hover:underline"
          }
        >
          Sign up
        </Link>
      </span>
    </div>
  );
}
