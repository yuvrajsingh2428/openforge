/**
 * Client-safe feature flag evaluation.
 * Decoupled from `@openforge/config` to prevent leaking server environment
 * secrets (GITHUB_TOKEN, OPENROUTER_API_KEY, DEBUG_API_SECRET) into client bundles.
 */

export function isAIEnabled(): boolean {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ENABLE_AI !== undefined) {
    return process.env.NEXT_PUBLIC_ENABLE_AI !== "false";
  }
  return true;
}

export function isRecommendationsEnabled(): boolean {
  if (
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ENABLE_RECOMMENDATIONS !== undefined
  ) {
    return process.env.NEXT_PUBLIC_ENABLE_RECOMMENDATIONS !== "false";
  }
  return true;
}

export function isMentorEnabled(): boolean {
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ENABLE_MENTOR !== undefined) {
    return process.env.NEXT_PUBLIC_ENABLE_MENTOR !== "false";
  }
  return true;
}

export function isRepositoryIntelligenceEnabled(): boolean {
  if (
    typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_ENABLE_REPOSITORY_INTELLIGENCE !== undefined
  ) {
    return process.env.NEXT_PUBLIC_ENABLE_REPOSITORY_INTELLIGENCE !== "false";
  }
  return true;
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return true;
  }
  return typeof process !== "undefined" && process.env?.NODE_ENV !== "test";
}
