import type { Issue } from "@openforge/github-client";

export type IssueSortKey = "newest" | "oldest" | "comments" | "updated" | "name";
export type IssueSortDirection = "asc" | "desc";

export interface IssueFiltersState {
  search: string;
  repository: string;
  language: string;
  label: string;
  state: string;
  author: string;
  sortKey: IssueSortKey;
  sortDirection: IssueSortDirection;
}

export const DEFAULT_ISSUE_FILTERS: IssueFiltersState = {
  search: "",
  repository: "",
  language: "",
  label: "",
  state: "",
  author: "",
  sortKey: "newest",
  sortDirection: "desc",
};

export type { Issue };
