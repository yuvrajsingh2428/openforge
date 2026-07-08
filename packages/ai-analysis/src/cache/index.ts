import { AI_CONFIG } from "@openforge/config";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface AICache {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttlMs?: number): void;
  invalidate(key: string): void;
  clear(): void;
}

export function buildCacheKey(type: string, identifier: string, promptVersion: string, model: string): string {
  return `${type}:${identifier}:${promptVersion}:${model}`;
}

export class InMemoryCache implements AICache {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtlMs: number;

  constructor(ttlMs?: number) {
    this.defaultTtlMs = ttlMs ?? AI_CONFIG.cacheTtlMs;
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs?: number): void {
    this.store.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
