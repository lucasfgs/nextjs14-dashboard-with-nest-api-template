import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/lib/getQueryClient";
import {
  GET_ALL_PERMISSIONS_QUERY,
  getAllPermissionsAction,
} from "@/services/api/permissions/use-get-all-permissions";
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

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
