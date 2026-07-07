import { PageInfo } from "../types/pagination";

export function extractPageInfo(data: any): PageInfo {
  return {
    hasNextPage: data?.pageInfo?.hasNextPage ?? false,
    endCursor: data?.pageInfo?.endCursor ?? null,
  };
}
