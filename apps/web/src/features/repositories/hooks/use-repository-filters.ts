"use client";

import { useState, useMemo, useCallback } from "react";
import type { RepositoryWithCategory, RepositoryFiltersState, SortKey, SortDirection } from "../types";
import { DEFAULT_FILTERS } from "../types";
import { filterRepositories, sortRepositories, getUniqueLanguages, getUniqueCategories } from "../utils/filters";

export function useRepositoryFilters(repositories: RepositoryWithCategory[], pageSize: number = 12) {
  const [filters, setFilters] = useState<RepositoryFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState<number>(1);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  }, []);

  const setLanguage = useCallback((language: string) => {
    setFilters((prev) => ({ ...prev, language }));
    setPage(1);
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setPage(1);
  }, []);

  const setSort = useCallback((sortKey: SortKey, sortDirection: SortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterRepositories(repositories, filters);
    return sortRepositories(matching, filters.sortKey, filters.sortDirection);
  }, [repositories, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const languages = useMemo(() => getUniqueLanguages(repositories), [repositories]);
  const categories = useMemo(() => getUniqueCategories(repositories), [repositories]);

  return {
    filters,
    filtered,
    paginated,
    page: currentPage,
    totalPages,
    pageSize,
    setPage,
    languages,
    categories,
    setSearch,
    setLanguage,
    setCategory,
    setSort,
    resetFilters,
  };
}
