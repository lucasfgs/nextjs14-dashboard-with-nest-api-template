import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

import { TPaginationParams } from "@/types/api";

interface UseDataTableOptions {
  defaultPageSize?: number;
  links?: {
    first: string;
    last: string;
    next: string | null;
    previous: string | null;
  };
}

export function useDataTable({
  defaultPageSize = 10,
  links,
}: UseDataTableOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize sorting state from URL
  const [sorting, setSorting] = useState<SortingState>(() => {
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    if (sortBy && sortOrder) {
      return [{ id: sortBy, desc: sortOrder === "desc" }];
    }
    return [];
  });

  // Initialize pagination state from URL
  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: Math.max(0, (Number(searchParams.get("page")) || 1) - 1),
    pageSize: Number(searchParams.get("limit")) || defaultPageSize,
  }));

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Update URL when pagination or sorting changes
  useEffect(() => {
    // If we have links from the API, use them for navigation
    if (links) {
      const currentPage = pagination.pageIndex + 1;
      let targetUrl: string | undefined;

      if (currentPage === 1 && links.first) {
        targetUrl = links.first;
      } else if (
        currentPage === Number(links.last.split("page=")[1]?.split("&")[0]) &&
        links.last
      ) {
        targetUrl = links.last;
      } else if (
        links.next &&
        currentPage === Number(links.next.split("page=")[1]?.split("&")[0]) - 1
      ) {
        targetUrl = links.next;
      } else if (
        links.previous &&
        currentPage ===
          Number(links.previous.split("page=")[1]?.split("&")[0]) + 1
      ) {
        targetUrl = links.previous;
      }

      if (targetUrl) {
        const url = new URL(targetUrl);
        router.push(`?${url.searchParams.toString()}`);
        return;
      }
    }

    // Fallback to manual URL construction if no links available
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pagination.pageIndex + 1));
    params.set("limit", String(pagination.pageSize));

    if (sorting.length > 0) {
      params.set("sortBy", sorting[0].id);
      params.set("sortOrder", sorting[0].desc ? "desc" : "asc");
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    router.push(`?${params.toString()}`);
  }, [pagination, sorting, router, searchParams, links]);

  return {
    sorting,
    setSorting,
    pagination,
    setPagination,
    columnFilters,
    setColumnFilters,
    // Helper to get the current sort parameters
    getSortParams: (): Pick<TPaginationParams, "sortBy" | "sortOrder"> => ({
      sortBy: sorting[0]?.id,
      sortOrder: sorting[0]?.desc ? "desc" : "asc",
    }),
    // Helper to get the current pagination parameters
    getPaginationParams: (): Pick<TPaginationParams, "page" | "limit"> => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
  };
}
