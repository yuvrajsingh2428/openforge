import type { Repository } from "@openforge/github-client";

export interface RepositoryWithCategory extends Repository {
  category: string;
}

export type SortKey = "stars" | "forks" | "updated" | "name";
export type SortDirection = "asc" | "desc";

export interface RepositoryFiltersState {
  search: string;
  language: string;
  category: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
}

export const DEFAULT_FILTERS: RepositoryFiltersState = {
  search: "",
  language: "",
  category: "",
  sortKey: "stars",
  sortDirection: "desc",
};
