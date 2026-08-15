import { z } from "zod";
import { AnalyticsEvents } from "./events";

// Base Event Schema
export const BaseEventSchema = z.object({
  name: z.string().min(1),
  properties: z.record(z.string(), z.any()).default({}),
  timestamp: z.string(),
  anonymousId: z.string().min(1),
  sessionId: z.string().optional(),
  version: z.string(),
});

// Event-specific schemas
export const PageViewPropertiesSchema = z.object({
  path: z.string(),
  title: z.string().optional(),
  referrer: z.string().optional(),
});

export const RepositorySearchPropertiesSchema = z.object({
  query: z.string(),
  filters: z.record(z.string(), z.any()).optional(),
  resultCount: z.number().int().nonnegative().optional(),
  durationMs: z.number().optional(),
});

export const RepositoryViewedPropertiesSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  stars: z.number().optional(),
  forks: z.number().optional(),
});

export const RepositoryHealthPropertiesSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  healthScore: z.number().min(0).max(100).optional(),
});

export const IssueViewedPropertiesSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().optional(),
});

export const RecommendationClickedPropertiesSchema = z.object({
  issueId: z.string(),
  overallScore: z.number(),
  rank: z.number().int().positive().optional(),
});

export const AIRequestPropertiesSchema = z.object({
  type: z.string(),
  provider: z.string(),
  model: z.string(),
  durationMs: z.number().nonnegative(),
  success: z.boolean(),
  cached: z.boolean().optional(),
  temperature: z.number().optional(),
  failureReason: z.string().optional(),
});

export const MentorSessionPropertiesSchema = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
  number: z.number().int().positive(),
  section: z.string().optional(),
});

export const WebVitalsPropertiesSchema = z.object({
  name: z.enum(["LCP", "CLS", "INP", "TTFB", "FCP"]),
  value: z.number(),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  delta: z.number().optional(),
});

export const ErrorPropertiesSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  componentStack: z.string().optional(),
});

// Event registry map for validation
export const EventSchemaMap: Record<string, z.ZodSchema> = {
  [AnalyticsEvents.PAGE_VIEWED]: PageViewPropertiesSchema,
  [AnalyticsEvents.REPOSITORY_SEARCH]: RepositorySearchPropertiesSchema,
  [AnalyticsEvents.REPOSITORY_VIEWED]: RepositoryViewedPropertiesSchema,
  [AnalyticsEvents.REPOSITORY_HEALTH_VIEWED]: RepositoryHealthPropertiesSchema,
  [AnalyticsEvents.ISSUE_VIEWED]: IssueViewedPropertiesSchema,
  [AnalyticsEvents.RECOMMENDATION_CLICKED]: RecommendationClickedPropertiesSchema,
  [AnalyticsEvents.AI_SUMMARY_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.AI_CONTRIBUTION_PLAN_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.AI_REPOSITORY_SUMMARY_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.AI_CONCEPT_EXTRACTION_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.AI_COMPLEXITY_ANALYSIS_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.AI_LEARNING_PATH_GENERATED]: AIRequestPropertiesSchema,
  [AnalyticsEvents.MENTOR_SESSION_STARTED]: MentorSessionPropertiesSchema,
  [AnalyticsEvents.WEB_VITALS_CAPTURED]: WebVitalsPropertiesSchema,
  [AnalyticsEvents.UNHANDLED_ERROR]: ErrorPropertiesSchema,
  [AnalyticsEvents.UNHANDLED_REJECTION]: ErrorPropertiesSchema,
};

export function validateEventPayload(name: string, properties: Record<string, any>): { valid: boolean; data?: any; error?: string } {
  const specificSchema = EventSchemaMap[name];
  if (!specificSchema) {
    return { valid: true, data: properties };
  }

  const result = specificSchema.safeParse(properties);
  if (!result.success) {
    const errorMsg = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    return { valid: false, error: errorMsg };
  }
  return { valid: true, data: result.data };
}
