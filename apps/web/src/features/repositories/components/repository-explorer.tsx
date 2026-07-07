"use client";

import type { RepositoryWithCategory } from "../types";
import { useRepositoryFilters } from "../hooks/use-repository-filters";
import { RepositoryHeader } from "./repository-header";
import { RepositorySearch } from "./repository-search";
import { RepositoryFilters } from "./repository-filters";
import { RepositorySort } from "./repository-sort";
import { RepositoryGrid } from "./repository-grid";
import { RepositoryEmptyState } from "./repository-empty-state";

interface RepositoryExplorerProps {
  repositories: RepositoryWithCategory[];
}

export function RepositoryExplorer({ repositories }: RepositoryExplorerProps) {
  const {
    filters,
    filtered,
    languages,
    categories,
    setSearch,
    setLanguage,
    setCategory,
    setSort,
    resetFilters,
  } = useRepositoryFilters(repositories);

  const hasActiveFilters = filters.search !== "" || filters.language !== "" || filters.category !== "";

  return (
    <div className="flex flex-col gap-6">
      <RepositoryHeader
        title="Repository Explorer"
        description="Discover curated open-source repositories based on quality, impact, and maintainer friendliness."
        resultCount={filtered.length}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <RepositorySearch value={filters.search} onChange={setSearch} />
        </div>
        <RepositoryFilters
          languages={languages}
          categories={categories}
          selectedLanguage={filters.language}
          selectedCategory={filters.category}
          onLanguageChange={setLanguage}
          onCategoryChange={setCategory}
        />
        <RepositorySort
          sortKey={filters.sortKey}
          sortDirection={filters.sortDirection}
          onSortChange={setSort}
        />
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <RepositoryGrid repositories={filtered} />
      ) : (
        <RepositoryEmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
      )}
    </div>
  );
}
