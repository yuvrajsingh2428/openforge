// Types
export type {
  AIProvider,
  AIAvailabilityResult,
  AIChatMessage,
  AIRawResponse,
  AIAnalysisResult,
  IssueContext,
  RepositoryContext,
  ComplexityLevel,
} from "./types";

// Schemas
export {
  IssueSummarySchema,
  ContributionPlanSchema,
  RepositorySummarySchema,
  LearningPathSchema,
  ConceptListSchema,
  ComplexityAnalysisSchema,
} from "./schemas";
export type {
  IssueSummary,
  ContributionPlan,
  RepositorySummary,
  LearningPath,
  ConceptList,
  ComplexityAnalysis,
} from "./schemas";

export { IssueAnalysisSchema, LearningResourceSchema } from "./schemas/issue-analysis";
export type { IssueAnalysis, LearningResource } from "./schemas/issue-analysis";

// Providers
export { OllamaProvider } from "./providers/ollama";
export { OpenRouterProvider } from "./providers/openrouter";
export { getAIProvider, resetAIProvider } from "./providers/base";
export { createAIProvider } from "./factory/providerFactory";

// Errors
export {
  AIProviderError,
  AIAuthenticationError,
  AIRateLimitError,
  AIModelNotFoundError,
  AITimeoutError,
  AINetworkError,
  AIResponseParseError,
} from "./errors";

// Services
export { generateIssueSummary, generateContributionPlan, generateComplexityAnalysis, generateConceptExtraction } from "./services/issue-analysis";
export { generateRepositorySummary } from "./services/repository-analysis";
export { generateLearningPath } from "./services/learning";

// Intelligent Issue Analysis (Phase AI-2)
export {
  analyzeIssue,
  buildIssueAnalysisContext,
  parseIssueAnalysisResponse,
  explainDifficulty,
  generateFormattedResources,
  generateLearningRoadmap,
  estimateTimeRequirements,
  predictFileDetails,
} from "./issue-analysis";
export type { IssueAnalysisContext, DifficultyBadgeLevel, DifficultyExplanation } from "./issue-analysis";

// Cache
export { InMemoryCache, buildCacheKey } from "./cache";
export type { AICache } from "./cache";

// Parser
export { parseAIResponse } from "./parsers";
