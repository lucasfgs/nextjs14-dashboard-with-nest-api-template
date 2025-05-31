export type TPaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TPaginationLinks = {
  first: string;
  last: string;
  next: string | null;
  previous: string | null;
};

export type TPaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type TPaginatedResponse<T> = {
  data: T;
  meta: TPaginationMeta;
  links: TPaginationLinks;
};
