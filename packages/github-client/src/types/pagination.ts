import { z } from "zod";

export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullable().optional(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export interface PaginatedResult<T> {
  nodes: T[];
  pageInfo: PageInfo;
  totalCount?: number;
}
