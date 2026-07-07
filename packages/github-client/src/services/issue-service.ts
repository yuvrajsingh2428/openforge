import { fetchGraphQL } from "../client";
import { GET_ISSUE_QUERY, GET_ISSUES_QUERY, GET_REPOSITORY_ISSUES_QUERY } from "../queries/issues";
import { Issue, IssueSchema, IssueRepositorySchema } from "../types/issue";
import { extractPageInfo } from "../utils/pagination";
import { PaginatedResult } from "../types/pagination";

export async function getIssue(
  owner: string,
  name: string,
  number: number
): Promise<{ issue: Issue; repository: { name: string; nameWithOwner: string; owner: { login: string; avatarUrl: string }; primaryLanguage?: { name: string; color?: string | null } | null } } | null> {
  const data = await fetchGraphQL<{ repository: { issue: unknown; name: string; nameWithOwner: string; owner: { login: string; avatarUrl: string }; primaryLanguage?: { name: string; color?: string | null } | null } }>({
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
  const data = await fetchGraphQL<{ search: { issueCount: number; edges: { node: unknown }[]; pageInfo: unknown } }>({
    query: GET_ISSUES_QUERY,
    variables: { query: searchQuery, first, after },
  });

  const searchData = data?.search;
  if (!searchData) {
    return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null }, totalCount: 0 };
  }

  const nodes = searchData.edges
    ?.map((edge) => edge.node)
    .filter(Boolean) ?? [];
  const parsedNodes = nodes.map((node) => IssueSchema.parse(node));

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
  const data = await fetchGraphQL<{ repository: { issues: { nodes: unknown[] }; name: string; nameWithOwner: string; owner: { login: string; avatarUrl: string }; primaryLanguage?: { name: string; color?: string | null } | null } }>({
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
    .map((node) => {
      const issue = IssueSchema.parse(node);
      return { ...issue, repository: repoInfo };
    });
}

export async function getIssuesFromCuratedRepos(
  repos: ReadonlyArray<{ owner: string; name: string }>,
  perRepo: number = 5
): Promise<Issue[]> {
  const results = await Promise.allSettled(
    repos.map(({ owner, name }) => getRepositoryIssues(owner, name, perRepo))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<Issue[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
}
