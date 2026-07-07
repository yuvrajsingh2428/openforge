"use client";

import { useState, useMemo, useCallback } from "react";
import type { RepositoryWithCategory, RepositoryFiltersState, SortKey, SortDirection } from "../types";
import { DEFAULT_FILTERS } from "../types";
import { filterRepositories, sortRepositories, getUniqueLanguages, getUniqueCategories } from "../utils/filters";

export function useRepositoryFilters(repositories: RepositoryWithCategory[]) {
  const [filters, setFilters] = useState<RepositoryFiltersState>(DEFAULT_FILTERS);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setFilters((prev) => ({ ...prev, language }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSort = useCallback((sortKey: SortKey, sortDirection: SortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterRepositories(repositories, filters);
    return sortRepositories(matching, filters.sortKey, filters.sortDirection);
  }, [repositories, filters]);

  const languages = useMemo(() => getUniqueLanguages(repositories), [repositories]);
  const categories = useMemo(() => getUniqueCategories(repositories), [repositories]);

  return {
    filters,
    filtered,
    languages,
    categories,
    setSearch,
    setLanguage,
    setCategory,
    setSort,
    resetFilters,
  };
}
