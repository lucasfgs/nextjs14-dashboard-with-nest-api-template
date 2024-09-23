import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import {
  GET_ALL_USERS_QUERY_KEY,
  getAllUsersAction,
} from "@/services/api/users/getAllUsers";
import { getQueryClient } from "@/lib/getQueryClient";
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllUsersAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
