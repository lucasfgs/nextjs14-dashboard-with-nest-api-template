import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getQueryClient } from "@/lib/getQueryClient";
import {
  GET_ROLE_QUERY_KEY,
  getRoleAction,
} from "@/services/api/roles/use-get-role";

interface HydrationProps {
  children: React.ReactNode;
  id: number;
}

export default async function Hydration({ children, id }: HydrationProps) {
  const queryClient = getQueryClient();

  queryClient.invalidateQueries({
    queryKey: GET_ROLE_QUERY_KEY,
  });

  await queryClient.prefetchQuery({
    queryKey: GET_ROLE_QUERY_KEY,
    queryFn: () => getRoleAction(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
