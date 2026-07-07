"use client";

import type { Issue } from "@openforge/github-client";
import { useIssueFilters } from "../hooks/use-issue-filters";
import { IssueHeader } from "./issue-header";
import { IssueSearch } from "./issue-search";
import { IssueFilters } from "./issue-filters";
import { IssueSort } from "./issue-sort";
import { IssueGrid } from "./issue-grid";
import { IssueEmptyState } from "./issue-empty-state";

interface IssueExplorerProps {
  issues: Issue[];
}

export function IssueExplorer({ issues }: IssueExplorerProps) {
  const {
    filters,
    filtered,
    repositories,
    languages,
    labels,
    setSearch,
    setRepository,
    setLanguage,
    setLabel,
    setState,
    setSort,
    resetFilters,
  } = useIssueFilters(issues);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.repository !== "" ||
    filters.language !== "" ||
    filters.label !== "" ||
    filters.state !== "";

  return (
    <div className="flex flex-col gap-6">
      <IssueHeader
        title="Issue Explorer"
        description="Find actionable issues that align with your skills and learning goals."
        resultCount={filtered.length}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <IssueSearch value={filters.search} onChange={setSearch} />
        </div>
        <IssueSort
          sortKey={filters.sortKey}
          sortDirection={filters.sortDirection}
          onSortChange={setSort}
        />
      </div>

      <IssueFilters
        repositories={repositories}
        languages={languages}
        labels={labels}
        selectedRepository={filters.repository}
        selectedLanguage={filters.language}
        selectedLabel={filters.label}
        selectedState={filters.state}
        onRepositoryChange={setRepository}
        onLanguageChange={setLanguage}
        onLabelChange={setLabel}
        onStateChange={setState}
      />

      {/* Results */}
      {filtered.length > 0 ? (
        <IssueGrid issues={filtered} />
      ) : (
        <IssueEmptyState hasFilters={hasActiveFilters} onReset={resetFilters} />
      )}
    </div>
  );
}
