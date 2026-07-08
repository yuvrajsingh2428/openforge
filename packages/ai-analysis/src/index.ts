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

// Provider
export { OllamaProvider } from "./providers/ollama";
export { getAIProvider, resetAIProvider } from "./providers/base";

// Services
export { generateIssueSummary, generateContributionPlan, generateComplexityAnalysis, generateConceptExtraction } from "./services/issue-analysis";
export { generateRepositorySummary } from "./services/repository-analysis";
export { generateLearningPath } from "./services/learning";

// Cache
export { InMemoryCache, buildCacheKey } from "./cache";
export type { AICache } from "./cache";

// Parser
export { parseAIResponse } from "./parsers";
