"use client";

import { useState, useMemo, useCallback } from "react";
import type { Issue } from "@openforge/github-client";
import type { IssueFiltersState, IssueSortKey, IssueSortDirection } from "../types";
import { DEFAULT_ISSUE_FILTERS } from "../types";
import {
  filterIssues,
  sortIssues,
  getUniqueRepositories,
  getUniqueLanguages,
  getUniqueLabels,
  getUniqueAuthors,
} from "../utils/filters";

export function useIssueFilters(issues: Issue[]) {
  const [filters, setFilters] = useState<IssueFiltersState>(DEFAULT_ISSUE_FILTERS);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setRepository = useCallback((repository: string) => {
    setFilters((prev) => ({ ...prev, repository }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setFilters((prev) => ({ ...prev, language }));
  }, []);

  const setLabel = useCallback((label: string) => {
    setFilters((prev) => ({ ...prev, label }));
  }, []);

  const setState = useCallback((state: string) => {
    setFilters((prev) => ({ ...prev, state }));
  }, []);

  const setAuthor = useCallback((author: string) => {
    setFilters((prev) => ({ ...prev, author }));
  }, []);

  const setSort = useCallback((sortKey: IssueSortKey, sortDirection: IssueSortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ISSUE_FILTERS);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterIssues(issues, filters);
    return sortIssues(matching, filters.sortKey, filters.sortDirection);
  }, [issues, filters]);

  const repositories = useMemo(() => getUniqueRepositories(issues), [issues]);
  const languages = useMemo(() => getUniqueLanguages(issues), [issues]);
  const labels = useMemo(() => getUniqueLabels(issues), [issues]);
  const authors = useMemo(() => getUniqueAuthors(issues), [issues]);

  return {
    filters,
    filtered,
    repositories,
    languages,
    labels,
    authors,
    setSearch,
    setRepository,
    setLanguage,
    setLabel,
    setState,
    setAuthor,
    setSort,
    resetFilters,
  };
}
