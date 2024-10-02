import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/lib/getQueryClient";
import {
  GET_ALL_PERMISSIONS_QUERY,
  getAllPermissionsAction,
} from "@/services/api/permissions/use-get-all-permissions";
import { GET_ROLE_QUERY_KEY } from "@/services/api/roles/use-get-role";
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  queryClient.setQueryData(GET_ROLE_QUERY_KEY, null);

  await queryClient.prefetchQuery({
    queryKey: GET_ALL_PERMISSIONS_QUERY,
    queryFn: getAllPermissionsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
