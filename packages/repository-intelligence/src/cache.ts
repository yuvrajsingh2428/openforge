import { Graph } from "./knowledge-graph/graph";
import type { RepositorySnapshot } from "./knowledge-graph/types";

interface CacheEntry {
  snapshot: RepositorySnapshot;
  graph: Graph;
  fetchedAt: Date;
}

/**
 * Maximum number of repository analyses to keep in memory.
 * Prevents unbounded heap growth in long-running server processes.
 */
const MAX_CACHE_ENTRIES = 50;

/**
 * Default TTL in seconds. Overridden by env.CACHE_TTL at runtime
 * via the configureTTL() method. Defaults to 1 hour.
 */
let cacheTTLSeconds = 3600;

const analysisCache = new Map<string, CacheEntry>();

/**
 * LRU-bounded, TTL-aware in-memory cache for repository analysis results.
 *
 * - Maximum capacity enforced via LRU eviction (oldest-inserted entry removed).
 * - TTL is configurable via `configureTTL()`, reading from `env.CACHE_TTL`.
 * - Stale entries are lazily evicted on `get()`.
 */
export class AnalysisCache {
  /**
   * Configure the cache TTL from the environment.
   * Called once at application startup from the web layer.
   */
  public static configureTTL(ttlSeconds: number): void {
    cacheTTLSeconds = ttlSeconds;
  }

  public static get(owner: string, repo: string): CacheEntry | undefined {
    const key = `${owner}/${repo}`.toLowerCase();
    const entry = analysisCache.get(key);
    if (!entry) return undefined;

    const maxAgeMs = cacheTTLSeconds * 1000;
    if (Date.now() - entry.fetchedAt.getTime() > maxAgeMs) {
      analysisCache.delete(key);
      return undefined;
    }

    // Move to end for LRU ordering (Map preserves insertion order)
    analysisCache.delete(key);
    analysisCache.set(key, entry);

    return entry;
  }

  public static set(owner: string, repo: string, entry: Omit<CacheEntry, "fetchedAt">): void {
    const key = `${owner}/${repo}`.toLowerCase();

    // If key already exists, delete first so it moves to end
    if (analysisCache.has(key)) {
      analysisCache.delete(key);
    }

    // Evict oldest entry (first key in Map) if at capacity
    if (analysisCache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = analysisCache.keys().next().value;
      if (oldestKey !== undefined) {
        analysisCache.delete(oldestKey);
      }
    }

    analysisCache.set(key, {
      ...entry,
      fetchedAt: new Date(),
    });
  }

  /** Clear all cached entries. Useful for testing and debug endpoints. */
  public static clear(): void {
    analysisCache.clear();
  }

  /** Returns the current number of cached entries. */
  public static get size(): number {
    return analysisCache.size;
  }
}
