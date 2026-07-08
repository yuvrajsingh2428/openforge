import { Graph } from "./knowledge-graph/graph";
import type { RepositorySnapshot } from "./knowledge-graph/types";

interface CacheEntry {
  snapshot: RepositorySnapshot;
  graph: Graph;
  fetchedAt: Date;
}

const analysisCache = new Map<string, CacheEntry>();

export class AnalysisCache {
  public static get(owner: string, repo: string): CacheEntry | undefined {
    const key = `${owner}/${repo}`.toLowerCase();
    const entry = analysisCache.get(key);
    if (!entry) return undefined;
    
    // Cache for 1 hour to verify changes or if it's stale
    const maxAge = 60 * 60 * 1000;
    if (new Date().getTime() - entry.fetchedAt.getTime() > maxAge) {
      analysisCache.delete(key);
      return undefined;
    }
    
    return entry;
  }

  public static set(owner: string, repo: string, entry: Omit<CacheEntry, "fetchedAt">): void {
    const key = `${owner}/${repo}`.toLowerCase();
    analysisCache.set(key, {
      ...entry,
      fetchedAt: new Date()
    });
  }
}
