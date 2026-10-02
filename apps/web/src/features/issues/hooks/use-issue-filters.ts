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

export function useIssueFilters(issues: Issue[], pageSize: number = 12) {
  const [filters, setFilters] = useState<IssueFiltersState>(DEFAULT_ISSUE_FILTERS);
  const [page, setPage] = useState<number>(1);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  }, []);

  const setRepository = useCallback((repository: string) => {
    setFilters((prev) => ({ ...prev, repository }));
    setPage(1);
  }, []);

  const setLanguage = useCallback((language: string) => {
    setFilters((prev) => ({ ...prev, language }));
    setPage(1);
  }, []);

  const setLabel = useCallback((label: string) => {
    setFilters((prev) => ({ ...prev, label }));
    setPage(1);
  }, []);

  const setState = useCallback((state: string) => {
    setFilters((prev) => ({ ...prev, state }));
    setPage(1);
  }, []);

  const setAuthor = useCallback((author: string) => {
    setFilters((prev) => ({ ...prev, author }));
    setPage(1);
  }, []);

  const setSort = useCallback((sortKey: IssueSortKey, sortDirection: IssueSortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ISSUE_FILTERS);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterIssues(issues, filters);
    return sortIssues(matching, filters.sortKey, filters.sortDirection);
  }, [issues, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const repositories = useMemo(() => getUniqueRepositories(issues), [issues]);
  const languages = useMemo(() => getUniqueLanguages(issues), [issues]);
  const labels = useMemo(() => getUniqueLabels(issues), [issues]);
  const authors = useMemo(() => getUniqueAuthors(issues), [issues]);

  return {
    filters,
    filtered,
    paginated,
    page: currentPage,
    totalPages,
    pageSize,
    setPage,
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
