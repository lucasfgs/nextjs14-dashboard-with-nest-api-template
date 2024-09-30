"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGetAllPermissions } from "@/services/api/permissions/use-get-all-permissions";
import { Textarea } from "@/components/ui/textarea";
import { useAddRole } from "@/services/api/roles/use-add-role";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(5).max(300),
  permissions: z
    .array(
      z.object({
        permissionId: z.number(),
        name: z.string(),
        description: z.string(),
        view: z.boolean(),
        create: z.boolean(),
        update: z.boolean(),
        delete: z.boolean(),
      })
    )
    .optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function RoleForm() {
  const { mutate: addRole } = useAddRole();
  const { data } = useGetAllPermissions();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: data?.map((permission) => ({
        permissionId: permission.id,
        name: permission.name,
        description: permission.description,
        view: false,
        create: false,
        update: false,
        delete: false,
      })),
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        ...form.getValues(),
        permissions: data.map((permission) => ({
          permissionId: permission.id,
          name: permission.name,
          description: permission.description,
          view: false,
          create: false,
          update: false,
          delete: false,
        })),
      });
    }
  }, [data, form]);

  async function onSubmit(values: FormSchema) {
    const payload = {
      name: values.name,
      description: values.description,
      permissions: values.permissions?.map((permission) => ({
        permissionId: permission.permissionId,
        view: permission.view,
        create: permission.create,
        update: permission.update,
        delete: permission.delete,
      })),
    };

    console.log("Payload: ", payload);
    await addRole(payload);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:mt-4">
            {/* Role Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="Admin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Some information about the role..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Permissions</h3>
                <CardDescription>
                  Assign permissions to this role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple">
                  {form.watch("permissions")?.map((permission, index) => (
                    <AccordionItem
                      key={permission.permissionId}
                      value={String(permission.permissionId)}
                    >
                      <AccordionTrigger>
                        <div className="flex justify-between items-center">
                          <h3 className="mr-2">{permission.name}</h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="text-muted-foreground size-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{permission.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="grid md:grid-cols-2 md:gap-x-12 md:gap-y-6 gap-4">
                        {/* Create Permission */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.create`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex justify-between items-center">
                              <FormLabel className="text-muted-foreground">
                                Create
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* View Permission */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.view`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex justify-between items-center">
                              <FormLabel className="text-muted-foreground">
                                View
                              </FormLabel>
                              <FormControl className="flex items-center ">
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Update Permission */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.update`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex justify-between items-center">
                              <FormLabel className="text-muted-foreground">
                                Update
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {/* Delete Permission */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.delete`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex justify-between items-center">
                              <FormLabel className="text-muted-foreground">
                                Delete
                              </FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
