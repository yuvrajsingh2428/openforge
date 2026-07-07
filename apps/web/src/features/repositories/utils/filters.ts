import type { RepositoryWithCategory, RepositoryFiltersState, SortKey, SortDirection } from "../types";

function matchesSearch(repo: RepositoryWithCategory, search: string): boolean {
  if (!search) return true;
  const term = search.toLowerCase();
  const name = repo.nameWithOwner.toLowerCase();
  const desc = (repo.description ?? "").toLowerCase();
  const topics = repo.repositoryTopics?.nodes
    .map((t) => t.topic.name.toLowerCase())
    .join(" ") ?? "";

  return name.includes(term) || desc.includes(term) || topics.includes(term);
}

function matchesLanguage(repo: RepositoryWithCategory, language: string): boolean {
  if (!language) return true;
  return repo.primaryLanguage?.name === language;
}

function matchesCategory(repo: RepositoryWithCategory, category: string): boolean {
  if (!category) return true;
  return repo.category === category;
}

export function filterRepositories(
  repositories: RepositoryWithCategory[],
  filters: RepositoryFiltersState,
): RepositoryWithCategory[] {
  return repositories.filter((repo) =>
    matchesSearch(repo, filters.search) &&
    matchesLanguage(repo, filters.language) &&
    matchesCategory(repo, filters.category)
  );
}

function getSortValue(repo: RepositoryWithCategory, key: SortKey): string | number {
  switch (key) {
    case "stars":
      return repo.stargazerCount;
    case "forks":
      return repo.forkCount;
    case "updated":
      return repo.updatedAt ?? "";
    case "name":
      return repo.nameWithOwner.toLowerCase();
  }
}

export function sortRepositories(
  repositories: RepositoryWithCategory[],
  key: SortKey,
  direction: SortDirection,
): RepositoryWithCategory[] {
  const sorted = [...repositories].sort((a, b) => {
    const aVal = getSortValue(a, key);
    const bVal = getSortValue(b, key);

    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }
    return String(aVal).localeCompare(String(bVal));
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}

export function getUniqueLanguages(repositories: RepositoryWithCategory[]): string[] {
  const languages = new Set<string>();
  for (const repo of repositories) {
    if (repo.primaryLanguage?.name) {
      languages.add(repo.primaryLanguage.name);
    }
  }
  return Array.from(languages).sort();
}

export function getUniqueCategories(repositories: RepositoryWithCategory[]): string[] {
  const categories = new Set<string>();
  for (const repo of repositories) {
    if (repo.category) {
      categories.add(repo.category);
    }
  }
  return Array.from(categories).sort();
}
