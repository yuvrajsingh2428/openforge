import { fetchGraphQL } from "../client";
import { GET_REPOSITORY_QUERY } from "../queries/repository";
import { GET_REPOSITORIES_QUERY } from "../queries/repositories";
import { Repository, RepositorySchema } from "../types/repository";
import { extractPageInfo } from "../utils/pagination";
import { PaginatedResult } from "../types/pagination";

export async function getRepository(owner: string, name: string): Promise<Repository | null> {
  const data = await fetchGraphQL<{ repository: unknown }>({
    query: GET_REPOSITORY_QUERY,
    variables: { owner, name },
  });

  if (!data?.repository) {
    return null;
  }

  return RepositorySchema.parse(data.repository);
}

export async function getRepositories(
  searchQuery: string,
  first: number = 10,
  after?: string
): Promise<PaginatedResult<Repository>> {
  const data = await fetchGraphQL<{ search: { repositoryCount: number; edges: { node: unknown }[]; pageInfo: unknown } }>({
    query: GET_REPOSITORIES_QUERY,
    variables: { query: searchQuery, first, after },
  });

  const searchData = data?.search;
  if (!searchData) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
  }

  const nodes = searchData.edges
    ?.map((edge) => edge.node)
    .filter(Boolean) ?? [];
  const parsedNodes = nodes.map((node) => RepositorySchema.parse(node));

  return {
    nodes: parsedNodes,
    pageInfo: extractPageInfo(searchData),
    totalCount: searchData.repositoryCount,
  };
}

export async function getRepositoriesByNames(
  repos: ReadonlyArray<{ owner: string; name: string }>
): Promise<Repository[]> {
  const results = await Promise.allSettled(
    repos.map(({ owner, name }) => getRepository(owner, name))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<Repository | null> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((r): r is Repository => r !== null);
}
