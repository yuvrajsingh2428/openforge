export interface RecommendationWeights {
  readonly learning: number;
  readonly aiRelevance: number;
  readonly maintainer: number;
  readonly impact: number;
  readonly mergeProbability: number;
}

export const RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  learning: 0.30,
  aiRelevance: 0.25,
  maintainer: 0.20,
  impact: 0.15,
  mergeProbability: 0.10,
} as const;
