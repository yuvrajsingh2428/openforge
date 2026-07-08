'use client';

import { useState } from 'react';
import { useRepositorySearch } from '../hooks/use-repository-search';
import { SearchFilters } from './search-filters';
import { SearchResults } from './search-results';
import { SearchSkeleton } from './search-skeleton';
import { SearchEmptyState } from './search-empty-state';
import { SearchErrorState } from './search-error-state';

export function SearchClient() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<{
    language?: string;
    architecture?: string;
    technology?: string;
    testingFramework?: string;
    buildTool?: string;
    packageManager?: string;
    database?: string;
    ci?: string;
  }>({});

  const { results, loading, error, loadMore } = useRepositorySearch(query, filters, 500); // 500ms debounce

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      <SearchFilters 
        query={query} 
        setQuery={setQuery} 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />
      
      {loading && !results && <SearchSkeleton />}
      
      {error && <SearchErrorState message={error} />}
      
      {!loading && !error && results && results.nodes.length === 0 && (
        <SearchEmptyState query={query} />
      )}
      
      {results && results.nodes.length > 0 && (
        <SearchResults 
          repositories={results.nodes} 
          loading={loading}
          hasNextPage={results.pageInfo.hasNextPage}
          onLoadMore={loadMore}
        />
      )}
    </div>
  );
}
