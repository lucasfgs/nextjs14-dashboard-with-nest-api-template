"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Info, Loader2 } from "lucide-react";

import { useGetAllPermissions } from "@/services/api/permissions/use-get-all-permissions";
import { useAddRole } from "@/services/api/roles/use-add-role";
import { useGetRole } from "@/services/api/roles/use-get-role";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUpdateRole } from "@/services/api/roles/use-update-role";

// Define validation schema using Zod
const formSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().min(5).max(300),
  permissions: z
    .array(
      z.object({
        permissionId: z.number(),
        name: z.string(),
        description: z.string(),
        read: z.boolean(),
        create: z.boolean(),
        update: z.boolean(),
        delete: z.boolean(),
      })
    )
    .optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface RoleFormProps {
  roleId: number;
}

export default function RoleForm({ roleId }: RoleFormProps) {
  const { mutate: addRole, isPending: addRolePending } = useAddRole();
  const { mutate: updateRole, isPending: updateRolePending } = useUpdateRole();
  const { data: role } = useGetRole(roleId);
  const { data: permissions } = useGetAllPermissions();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  // When role or permissions data is available, reset the form with the updated values
  useEffect(() => {
    if (role && permissions) {
      form.reset({
        name: role?.name || "",
        description: role?.description || "",
        permissions:
          permissions?.map((permission) => {
            const existingPermission = role?.permissions?.find(
              (p) => p.id === permission.id
            );
            return {
              permissionId: permission.id,
              name: permission.name,
              description: permission.description,
              read: existingPermission?.read || false,
              create: existingPermission?.create || false,
              update: existingPermission?.update || false,
              delete: existingPermission?.delete || false,
            };
          }) || [],
      });
    }
  }, [role, permissions, form]);

  async function onSubmit(values: FormSchema) {
    const payload = {
      name: values.name,
      description: values.description,
      permissions: values.permissions?.map((permission) => ({
        permissionId: permission.permissionId,
        read: permission.read,
        create: permission.create,
        update: permission.update,
        delete: permission.delete,
      })),
    };

    if (roleId) {
      await updateRole({ id: roleId, payload });
    } else {
      await addRole(payload);
    }
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
                        {/* Read Permission */}
                        <FormField
                          control={form.control}
                          name={`permissions.${index}.read`}
                          render={({ field }) => (
                            <FormItem className="space-y-0 flex justify-between items-center">
                              <FormLabel className="text-muted-foreground">
                                Read
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
            <Button
              type="submit"
              disabled={
                addRolePending || updateRolePending || !form.formState.isValid
              }
            >
              {addRolePending || updateRolePending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
