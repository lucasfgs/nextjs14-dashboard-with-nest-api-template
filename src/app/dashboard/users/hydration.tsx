import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/lib/getQueryClient";
import {
  GET_ALL_USERS_QUERY_KEY,
  getAllUsersAction,
} from "@/services/api/users/use-get-all-users";
import { createPaginationQueryKey } from "@/utils/pagination";

export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: createPaginationQueryKey(GET_ALL_USERS_QUERY_KEY, {
      limit: 10,
      page: 1,
      sortOrder: "asc",
    }),
    queryFn: () =>
      getAllUsersAction({
        limit: 10,
        page: 1,
        sortOrder: "asc",
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
