import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";

import { getAllUsersAction } from "@/services/api/users/actions/getAllUsers";
import { GET_ALL_USERS_QUERY_KEY } from "@/services/api/users/useGetAllUsers";
import { getQueryClient } from "@/lib/getQueryClient";
export default async function Hydration({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: GET_ALL_USERS_QUERY_KEY,
    queryFn: async () => await getAllUsersAction(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
