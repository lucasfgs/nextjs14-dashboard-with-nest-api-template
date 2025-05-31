import { TPaginationParams } from "@/types/api";

export const createPaginationQueryKey = (
  baseKey: readonly unknown[],
  params: TPaginationParams = {}
) => {
  const { page, limit, sortBy, sortOrder } = params;
  return [...baseKey, { page, limit, sortBy, sortOrder }] as const;
};

export const createPaginationSearchParams = (params: TPaginationParams) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.limit) searchParams.append("limit", params.limit.toString());
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
  return searchParams;
};

export const createPaginationUrl = (
  path: string,
  params: TPaginationParams
) => {
  const searchParams = createPaginationSearchParams(params);
  return `${path}?${searchParams.toString()}`;
};
