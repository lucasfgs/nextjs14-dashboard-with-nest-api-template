"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  AccordionContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllPermissions } from "@/services/api/permissions/use-get-all-permissions";

const formSchema = z.object({
  name: z.string().min(3).max(50),
});

type FormSchema = z.infer<typeof formSchema>;

export default function RoleForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data } = useGetAllPermissions();

  async function onSubmit(values: FormSchema) {}

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:mt-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        autoFocus
                        autoCorrect="off"
                        placeholder="John Doe"
                        // disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Permissions</h3>
                  <CardDescription>
                    Assign permissions to this role.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple">
                    {data?.map((permission) => (
                      <AccordionItem value={permission.id} key={permission.id}>
                        <AccordionTrigger>
                          <div className="flex justify-items-center">
                            <h3 className="mr-2">{permission.name}</h3>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="text-muted-foreground size-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{permission.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="grid grid-cols-2 gap-x-12 gap-y-6">
                          <div className="flex justify-between items-center">
                            <Label
                              className="text-muted-foreground"
                              htmlFor={`view-${permission.id}`}
                            >
                              1. View
                            </Label>
                            <Switch id={`view-${permission.id}`} />
                          </div>
                          <div className="flex justify-between items-center">
                            <Label
                              className="text-muted-foreground"
                              htmlFor={`create-${permission.id}`}
                            >
                              2. Create
                            </Label>
                            <Switch id={`create-${permission.id}`} />
                          </div>
                          <div className="flex justify-between items-center">
                            <Label
                              className="text-muted-foreground"
                              htmlFor={`update-${permission.id}`}
                            >
                              3. Update
                            </Label>
                            <Switch id={`update-${permission.id}`} />
                          </div>
                          <div className="flex justify-between items-center">
                            <Label
                              className="text-muted-foreground"
                              htmlFor={`delete-${permission.id}`}
                            >
                              4. Delete
                            </Label>
                            <Switch id={`delete-${permission.id}`} />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            <Button
              className=""
              // disabled={isPending}
            >
              {/* {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )} */}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
