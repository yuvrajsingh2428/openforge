export type {
  ScoringSignals,
  FactorScore,
  RecommendationBreakdown,
  RecommendationExplanation,
  Recommendation,
  ScoringEngine,
} from "./types";

export { scoreIssue, generateRecommendations } from "./services/recommendation-service";
export { extractSignals, enrichSignalsWithRepo, clampScore } from "./utils/signals";
export { learningEngine } from "./engines/learning";
export { aiRelevanceEngine } from "./engines/ai-relevance";
export { maintainerEngine } from "./engines/maintainer";
export { impactEngine } from "./engines/impact";
export { mergeProbabilityEngine } from "./engines/merge-probability";
export { generateExplanation } from "./engines/explanation";
