import { env } from "@openforge/config";

export function isAIEnabled(): boolean {
  return env.ENABLE_AI ?? true;
}

export function isRecommendationsEnabled(): boolean {
  return env.ENABLE_RECOMMENDATIONS ?? true;
}

export function isMentorEnabled(): boolean {
  return env.ENABLE_MENTOR ?? true;
}

export function isRepositoryIntelligenceEnabled(): boolean {
  return env.ENABLE_REPOSITORY_INTELLIGENCE ?? true;
}

export function isAnalyticsEnabled(): boolean {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return true;
  }
  return env.NODE_ENV !== "test";
}
