import { getRepositories } from "./repository-service";
import { Repository } from "../types/repository";
import { PaginatedResult } from "../types/pagination";

export async function searchRepositories(
  query: string,
  first: number = 20,
  after?: string
): Promise<PaginatedResult<Repository>> {
  // Alias to the existing repository search which implements the exact GraphQL 
  // query for `search(query: $query, type: REPOSITORY, first: $first, after: $after)`
  return getRepositories(query, first, after);
}
