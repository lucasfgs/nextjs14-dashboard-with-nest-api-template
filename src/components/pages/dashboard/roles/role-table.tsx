"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/custom/data-table/column-header";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table/pagination";
import { DataTableViewOptions } from "@/components/custom/data-table/view-options";
import { cn } from "@/lib/utils";
import {
  TGetAllRolesResponse,
  useGetAllRoles,
} from "@/services/api/roles/use-get-all-roles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteRole } from "@/services/api/roles/use-delete-role";
import { useCanAccess } from "@/utils/hooks/useCanAccess";
import { EPermission, EPermissionType } from "@/configs/permissions";

interface RoleTableProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function RoleTable({ className, ...props }: RoleTableProps) {
  const defaultData = useMemo(() => [], []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { mutate: deleteRole } = useDeleteRole();
  const { data } = useGetAllRoles();
  const canUpdateRole = useCanAccess(EPermission.ROLES, EPermissionType.UPDATE);
  const canDeleteRole = useCanAccess(EPermission.ROLES, EPermissionType.DELETE);

  const columns: ColumnDef<TGetAllRolesResponse>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const role = row.original;
        const [isAlertOpen, setIsAlertOpen] = useState(false);
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        const handleDelete = async () => {
          await deleteRole(Number(role.id));
          setIsAlertOpen(false);
          setIsDropdownOpen(false);
        };

        return (
          <>
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {canUpdateRole && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/roles/edit/${role.id}`}
                      className="w-full h-full"
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                )}
                {canDeleteRole && (
                  <DropdownMenuItem
                    onSelect={() => {
                      setIsAlertOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the role and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];

  // If cannot update and delete role, hide the actions column from the table
  if (!canUpdateRole && !canDeleteRole) {
    columns.pop();
  }

  const table = useReactTable({
    columns,
    data: data || defaultData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className={cn("", className)} {...props}>
      <div className="flex items-center py-4">
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
}
