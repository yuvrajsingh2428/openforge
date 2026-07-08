import { useState, useEffect, useRef } from 'react';
import { Repository } from '@openforge/github-client';

interface SearchResult {
  nodes: Repository[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
  totalCount: number;
}

const searchCache = new Map<string, SearchResult>();

interface SearchFiltersParams {
  language?: string;
  architecture?: string;
  technology?: string;
  testingFramework?: string;
  buildTool?: string;
  packageManager?: string;
  database?: string;
  ci?: string;
}

export function useRepositorySearch(query: string, filters: SearchFiltersParams = {}, delay: number = 300) {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const getQueryParams = (q: string, params: SearchFiltersParams, cursor?: string) => {
    const urlParams = new URLSearchParams();
    urlParams.set('q', q);
    if (params.language) urlParams.set('language', params.language);
    if (params.architecture) urlParams.set('architecture', params.architecture);
    if (params.technology) urlParams.set('technology', params.technology);
    if (params.testingFramework) urlParams.set('testingFramework', params.testingFramework);
    if (params.buildTool) urlParams.set('buildTool', params.buildTool);
    if (params.packageManager) urlParams.set('packageManager', params.packageManager);
    if (params.database) urlParams.set('database', params.database);
    if (params.ci) urlParams.set('ci', params.ci);
    if (cursor) urlParams.set('after', cursor);
    return urlParams.toString();
  };

  useEffect(() => {
    const hasFilters = Object.values(filters).some(Boolean);
    if (!query.trim() && !hasFilters) {
      setResults(null);
      return;
    }

    const timer = setTimeout(() => {
      const qParams = getQueryParams(query, filters);
      const cacheKey = qParams;
      
      if (searchCache.has(cacheKey)) {
        setResults(searchCache.get(cacheKey)!);
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      fetch(`/api/search/repositories?${qParams}`, {
        signal: abortController.signal
      })
        .then(res => {
          if (!res.ok) throw new Error('Search failed');
          return res.json();
        })
        .then(data => {
          searchCache.set(cacheKey, data);
          setResults(data);
          setLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          setError(err.message);
          setLoading(false);
        });
    }, delay);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, JSON.stringify(filters), delay]);

  const loadMore = () => {
    if (loading || !results?.pageInfo.hasNextPage || !results.pageInfo.endCursor) return;
    
    setLoading(true);
    const qParams = getQueryParams(query, filters, results.pageInfo.endCursor);
    const cacheKey = getQueryParams(query, filters);
    
    fetch(`/api/search/repositories?${qParams}`)
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        const newData = {
          ...data,
          nodes: [...results.nodes, ...data.nodes]
        };
        searchCache.set(cacheKey, newData);
        setResults(newData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return { results, loading, error, loadMore };
}
