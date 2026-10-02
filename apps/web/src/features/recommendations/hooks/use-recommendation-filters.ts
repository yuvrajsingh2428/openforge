"use client";

import { useState, useMemo, useCallback } from "react";
import type { Recommendation } from "@openforge/recommendation-engine";
import type { RecommendationFiltersState, RecommendationSortKey, RecommendationSortDirection } from "../types";
import { DEFAULT_RECOMMENDATION_FILTERS } from "../types";
import {
  filterRecommendations,
  sortRecommendations,
  getUniqueRepositories,
  getUniqueLanguages,
  getUniqueCategories,
} from "../utils/filters";

export function useRecommendationFilters(recommendations: Recommendation[], pageSize: number = 12) {
  const [filters, setFilters] = useState<RecommendationFiltersState>(DEFAULT_RECOMMENDATION_FILTERS);
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

  const setDifficulty = useCallback((difficulty: string) => {
    setFilters((prev) => ({ ...prev, difficulty }));
    setPage(1);
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setPage(1);
  }, []);

  const setMinScore = useCallback((minScore: number) => {
    setFilters((prev) => ({ ...prev, minScore }));
    setPage(1);
  }, []);

  const setSort = useCallback((sortKey: RecommendationSortKey, sortDirection: RecommendationSortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_RECOMMENDATION_FILTERS);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterRecommendations(recommendations, filters);
    return sortRecommendations(matching, filters.sortKey, filters.sortDirection);
  }, [recommendations, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const repositories = useMemo(() => getUniqueRepositories(recommendations), [recommendations]);
  const languages = useMemo(() => getUniqueLanguages(recommendations), [recommendations]);
  const categories = useMemo(() => getUniqueCategories(recommendations), [recommendations]);

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
    categories,
    setSearch,
    setRepository,
    setLanguage,
    setDifficulty,
    setCategory,
    setMinScore,
    setSort,
    resetFilters,
  };
}
