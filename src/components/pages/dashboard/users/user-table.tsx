"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useMemo } from "react";
import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableColumnHeader } from "@/components/custom/data-table/column-header";
import { DataTable } from "@/components/custom/data-table";
import { DataTablePagination } from "@/components/custom/data-table/pagination";
import { DataTableViewOptions } from "@/components/custom/data-table/view-options";
import { useDataTable } from "@/components/custom/data-table/use-data-table";
import { cn } from "@/lib/utils";
import {
  TGetAllUsersResponse,
  useGetAllUsers,
  GET_ALL_USERS_QUERY_KEY,
} from "@/services/api/users/use-get-all-users";
import { createPaginationQueryKey } from "@/utils/pagination";

interface UserTableProps extends React.HTMLAttributes<HTMLDivElement> {
  users?: TGetAllUsersResponse["data"];
  initialData?: TGetAllUsersResponse;
}

const columns: ColumnDef<TGetAllUsersResponse["data"][0]>[] = [
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return new Date(user.created_at).toLocaleString();
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.name)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function UserTable({
  users,
  className,
  ...props
}: UserTableProps) {
  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    getSortParams,
    getPaginationParams,
  } = useDataTable();

  const params = useMemo(
    () => ({
      ...getPaginationParams(),
      ...getSortParams(),
    }),
    [getPaginationParams, getSortParams]
  );

  const { data, isLoading } = useGetAllUsers(params, {
    queryKey: createPaginationQueryKey(GET_ALL_USERS_QUERY_KEY, params),
  });

  // Update pagination when data changes
  useEffect(() => {
    const page = data?.meta?.page;
    if (typeof page === "number") {
      setPagination((prev) => ({
        ...prev,
        pageIndex: page - 1,
      }));
    }
  }, [data?.meta?.page, setPagination]);

  const table = useReactTable({
    columns,
    data: data?.data || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.meta?.totalPages || 0,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
  });

  return (
    <div className={cn("", className)} {...props}>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <DataTable
        table={table}
        isLoading={isLoading}
        loadingRows={pagination.pageSize}
      />
      <DataTablePagination table={table} />
    </div>
  );
}
