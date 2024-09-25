import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { GET_ALL_USERS_QUERY_KEY } from "@/services/api/users/use-get-all-users";
import { getQueryClient } from "@/lib/getQueryClient";
import { getAllRolesAction } from "@/services/api/roles/use-get-all-roles";
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: getAllRolesAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
