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

export function useRecommendationFilters(recommendations: Recommendation[]) {
  const [filters, setFilters] = useState<RecommendationFiltersState>(DEFAULT_RECOMMENDATION_FILTERS);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setRepository = useCallback((repository: string) => {
    setFilters((prev) => ({ ...prev, repository }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setFilters((prev) => ({ ...prev, language }));
  }, []);

  const setDifficulty = useCallback((difficulty: string) => {
    setFilters((prev) => ({ ...prev, difficulty }));
  }, []);

  const setCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setMinScore = useCallback((minScore: number) => {
    setFilters((prev) => ({ ...prev, minScore }));
  }, []);

  const setSort = useCallback((sortKey: RecommendationSortKey, sortDirection: RecommendationSortDirection) => {
    setFilters((prev) => ({ ...prev, sortKey, sortDirection }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_RECOMMENDATION_FILTERS);
  }, []);

  const filtered = useMemo(() => {
    const matching = filterRecommendations(recommendations, filters);
    return sortRecommendations(matching, filters.sortKey, filters.sortDirection);
  }, [recommendations, filters]);

  const repositories = useMemo(() => getUniqueRepositories(recommendations), [recommendations]);
  const languages = useMemo(() => getUniqueLanguages(recommendations), [recommendations]);
  const categories = useMemo(() => getUniqueCategories(recommendations), [recommendations]);

  return {
    filters,
    filtered,
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
