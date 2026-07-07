import type { RecommendationWeights } from "@openforge/config";
import type { RecommendationBreakdown, RecommendationExplanation } from "../../types";

const FACTOR_LABELS: Record<keyof RecommendationBreakdown, string> = {
  learning: "Learning Value",
  aiRelevance: "AI Relevance",
  maintainer: "Maintainer Friendliness",
  impact: "Impact",
  mergeProbability: "Merge Probability",
};

export function generateExplanation(
  breakdown: RecommendationBreakdown,
  weights: RecommendationWeights,
  overallScore: number,
): RecommendationExplanation {
  const factors = (Object.keys(FACTOR_LABELS) as (keyof RecommendationBreakdown)[]).map((key) => {
    const factor = breakdown[key];
    const weight = weights[key];
    return {
      name: FACTOR_LABELS[key],
      score: factor.score,
      weight,
      weightedScore: Math.round(factor.score * weight),
      topReason: factor.reasons[0] ?? "No specific signal detected",
    };
  });

  // Sort by weighted contribution, descending
  factors.sort((a, b) => b.weightedScore - a.weightedScore);

  const topFactor = factors[0];
  let summary: string;

  if (overallScore >= 80) {
    summary = `Highly recommended. ${topFactor.name} is the strongest factor: ${topFactor.topReason.toLowerCase()}.`;
  } else if (overallScore >= 60) {
    summary = `Good match. ${topFactor.name} contributes most: ${topFactor.topReason.toLowerCase()}.`;
  } else if (overallScore >= 40) {
    summary = `Moderate match. ${topFactor.name} is the leading factor: ${topFactor.topReason.toLowerCase()}.`;
  } else {
    summary = `Lower priority. ${topFactor.name} provides some value: ${topFactor.topReason.toLowerCase()}.`;
  }

  return { summary, factors };
}
