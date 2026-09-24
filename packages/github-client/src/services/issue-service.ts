import { fetchGraphQL } from "../client";
import { GET_ISSUE_QUERY, GET_ISSUES_QUERY, GET_REPOSITORY_ISSUES_QUERY } from "../queries/issues";
import { Issue, IssueSchema, IssueRepositorySchema } from "../types/issue";
import { extractPageInfo } from "../utils/pagination";
import { PaginatedResult } from "../types/pagination";

export async function getIssue(
  owner: string,
  name: string,
  number: number
): Promise<{
  issue: Issue;
  repository: {
    name: string;
    nameWithOwner: string;
    owner: { login: string; avatarUrl: string };
    primaryLanguage?: { name: string; color?: string | null } | null;
  };
} | null> {
  const data = await fetchGraphQL<{
    repository: {
      issue: unknown;
      name: string;
      nameWithOwner: string;
      owner: { login: string; avatarUrl: string };
      primaryLanguage?: { name: string; color?: string | null } | null;
    };
  }>({
    query: GET_ISSUE_QUERY,
    variables: { owner, name, number },
  });

  if (!data?.repository?.issue) {
    return null;
  }

  const issue = IssueSchema.parse(data.repository.issue);
  const repository = {
    name: data.repository.name,
    nameWithOwner: data.repository.nameWithOwner,
    owner: data.repository.owner,
    primaryLanguage: data.repository.primaryLanguage,
  };

  return { issue, repository };
}

export async function getIssues(
  searchQuery: string,
  first: number = 10,
  after?: string
): Promise<PaginatedResult<Issue>> {
  const data = await fetchGraphQL<{
    search: { issueCount: number; edges: { node: unknown }[]; pageInfo: unknown };
  }>({
    query: GET_ISSUES_QUERY,
    variables: { query: searchQuery, first, after },
  });

  const searchData = data?.search;
  if (!searchData) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
  }

  const nodes = searchData.edges?.map((edge) => edge.node).filter(Boolean) ?? [];
  const parsedNodes = nodes
    .map((node) => IssueSchema.safeParse(node))
    .filter((r): r is { success: true; data: Issue } => r.success)
    .map((r) => r.data);

  return {
    nodes: parsedNodes,
    pageInfo: extractPageInfo(searchData),
    totalCount: searchData.issueCount,
  };
}

export async function getRepositoryIssues(
  owner: string,
  name: string,
  first: number = 15,
  states?: string[]
): Promise<Issue[]> {
  const data = await fetchGraphQL<{
    repository: {
      issues: { nodes: unknown[] };
      name: string;
      nameWithOwner: string;
      owner: { login: string; avatarUrl: string };
      primaryLanguage?: { name: string; color?: string | null } | null;
    };
  }>({
    query: GET_REPOSITORY_ISSUES_QUERY,
    variables: { owner, name, first, states: states ?? ["OPEN"] },
  });

  if (!data?.repository?.issues?.nodes) {
    return [];
  }

  const repoInfo = IssueRepositorySchema.parse({
    name: data.repository.name,
    nameWithOwner: data.repository.nameWithOwner,
    owner: data.repository.owner,
    primaryLanguage: data.repository.primaryLanguage,
  });

  return data.repository.issues.nodes
    .filter(Boolean)
    .map((node) => IssueSchema.safeParse(node))
    .filter((r): r is { success: true; data: Issue } => r.success)
    .map((r) => ({ ...r.data, repository: repoInfo }));
}

/** Max concurrent GitHub API requests to avoid secondary rate limits. */
const MAX_CONCURRENCY = 5;

/**
 * Run an array of async task factories with bounded concurrency.
 * Prevents overwhelming the GitHub API with too many simultaneous requests.
 */
async function withConcurrencyLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const idx = nextIndex++;
      try {
        results[idx] = { status: "fulfilled", value: await tasks[idx]() };
      } catch (reason: any) {
        results[idx] = { status: "rejected", reason };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function getIssuesFromCuratedRepos(
  repos: ReadonlyArray<{ owner: string; name: string }>,
  perRepo: number = 5
): Promise<Issue[]> {
  const tasks = repos.map(
    ({ owner, name }) =>
      () =>
        getRepositoryIssues(owner, name, perRepo)
  );
  const results = await withConcurrencyLimit(tasks, MAX_CONCURRENCY);

  return results
    .filter((r): r is PromiseFulfilledResult<Issue[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}
