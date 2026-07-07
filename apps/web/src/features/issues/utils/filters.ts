import type { Issue } from "@openforge/github-client";
import type { IssueFiltersState, IssueSortKey, IssueSortDirection } from "../types";

function matchesSearch(issue: Issue, search: string): boolean {
  if (!search) return true;
  const term = search.toLowerCase();
  const title = issue.title.toLowerCase();
  const body = (issue.body ?? "").toLowerCase();
  const labels = issue.labels?.nodes.map((l) => l.name.toLowerCase()).join(" ") ?? "";
  const repo = issue.repository?.nameWithOwner?.toLowerCase() ?? "";
  return title.includes(term) || body.includes(term) || labels.includes(term) || repo.includes(term);
}

function matchesRepository(issue: Issue, repository: string): boolean {
  if (!repository) return true;
  return issue.repository?.nameWithOwner === repository;
}

function matchesLanguage(issue: Issue, language: string): boolean {
  if (!language) return true;
  return issue.repository?.primaryLanguage?.name === language;
}

function matchesLabel(issue: Issue, label: string): boolean {
  if (!label) return true;
  return issue.labels?.nodes.some((l) => l.name === label) ?? false;
}

function matchesState(issue: Issue, state: string): boolean {
  if (!state) return true;
  return issue.state === state;
}

function matchesAuthor(issue: Issue, author: string): boolean {
  if (!author) return true;
  return issue.author?.login === author;
}

export function filterIssues(issues: Issue[], filters: IssueFiltersState): Issue[] {
  return issues.filter((issue) =>
    matchesSearch(issue, filters.search) &&
    matchesRepository(issue, filters.repository) &&
    matchesLanguage(issue, filters.language) &&
    matchesLabel(issue, filters.label) &&
    matchesState(issue, filters.state) &&
    matchesAuthor(issue, filters.author)
  );
}

function getSortValue(issue: Issue, key: IssueSortKey): string | number {
  switch (key) {
    case "newest":
    case "oldest":
      return issue.createdAt;
    case "comments":
      return issue.comments?.totalCount ?? 0;
    case "updated":
      return issue.updatedAt ?? issue.createdAt;
    case "name":
      return issue.title.toLowerCase();
  }
}

export function sortIssues(issues: Issue[], key: IssueSortKey, direction: IssueSortDirection): Issue[] {
  const sorted = [...issues].sort((a, b) => {
    const aVal = getSortValue(a, key);
    const bVal = getSortValue(b, key);
    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }
    return String(aVal).localeCompare(String(bVal));
  });

  if (key === "newest") return sorted.reverse();
  if (key === "oldest") return sorted;
  return direction === "desc" ? sorted.reverse() : sorted;
}

export function getUniqueRepositories(issues: Issue[]): string[] {
  const repos = new Set<string>();
  for (const issue of issues) {
    if (issue.repository?.nameWithOwner) {
      repos.add(issue.repository.nameWithOwner);
    }
  }
  return Array.from(repos).sort();
}

export function getUniqueLanguages(issues: Issue[]): string[] {
  const langs = new Set<string>();
  for (const issue of issues) {
    if (issue.repository?.primaryLanguage?.name) {
      langs.add(issue.repository.primaryLanguage.name);
    }
  }
  return Array.from(langs).sort();
}

export function getUniqueLabels(issues: Issue[]): string[] {
  const labels = new Set<string>();
  for (const issue of issues) {
    for (const label of issue.labels?.nodes ?? []) {
      labels.add(label.name);
    }
  }
  return Array.from(labels).sort();
}

export function getUniqueAuthors(issues: Issue[]): string[] {
  const authors = new Set<string>();
  for (const issue of issues) {
    if (issue.author?.login) {
      authors.add(issue.author.login);
    }
  }
  return Array.from(authors).sort();
}
