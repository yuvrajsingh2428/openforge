"use client";

import type { Recommendation } from "@openforge/recommendation-engine";
import { useRecommendationFilters } from "../hooks/use-recommendation-filters";
import { RecommendationHeader } from "./recommendation-header";
import { RecommendationSearch } from "./recommendation-search";
import { RecommendationFilters } from "./recommendation-filters";
import { RecommendationSort } from "./recommendation-sort";
import { RecommendationGrid } from "./recommendation-grid";
import { RecommendationEmptyState } from "./recommendation-empty-state";

interface RecommendationExplorerProps {
  recommendations: Recommendation[];
}

export function RecommendationExplorer({ recommendations }: RecommendationExplorerProps) {
  const {
    filters,
    filtered,
    repositories,
    languages,
    categories,
    setSearch,
    setRepository,
    setLanguage,
    setCategory,
    setMinScore,
    setSort,
    resetFilters,
  } = useRecommendationFilters(recommendations);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.repository !== "" ||
    filters.language !== "" ||
    filters.category !== "" ||
    filters.minScore > 0;

  return (
    <div className="flex flex-col gap-6">
      <RecommendationHeader
        title="Recommendations"
        description="Discover impactful issues tailored to your skills, scored deterministically by our recommendation engine."
        resultCount={filtered.length}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <RecommendationSearch value={filters.search} onChange={setSearch} />
        </div>
        <RecommendationSort
          sortKey={filters.sortKey}
          sortDirection={filters.sortDirection}
          onSortChange={setSort}
        />
      </div>

      <RecommendationFilters
        repositories={repositories}
        languages={languages}
        categories={categories}
        selectedRepository={filters.repository}
        selectedLanguage={filters.language}
        selectedCategory={filters.category}
        selectedMinScore={filters.minScore}
        onRepositoryChange={setRepository}
        onLanguageChange={setLanguage}
        onCategoryChange={setCategory}
        onMinScoreChange={setMinScore}
      />

      {filtered.length > 0 ? (
        <RecommendationGrid recommendations={filtered} />
      ) : (
        <RecommendationEmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
      )}
    </div>
  );
}
