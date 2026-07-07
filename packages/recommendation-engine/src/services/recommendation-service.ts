import type { Issue } from "@openforge/github-client";
import { RECOMMENDATION_WEIGHTS } from "@openforge/config";
import type { Recommendation, RecommendationBreakdown, ScoringSignals } from "../types";
import { learningEngine } from "../engines/learning";
import { aiRelevanceEngine } from "../engines/ai-relevance";
import { maintainerEngine } from "../engines/maintainer";
import { impactEngine } from "../engines/impact";
import { mergeProbabilityEngine } from "../engines/merge-probability";
import { generateExplanation } from "../engines/explanation";
import { extractSignals } from "../utils/signals";
import { clampScore } from "../utils/signals";

function computeBreakdown(signals: ScoringSignals): RecommendationBreakdown {
  return {
    learning: learningEngine.score(signals),
    aiRelevance: aiRelevanceEngine.score(signals),
    maintainer: maintainerEngine.score(signals),
    impact: impactEngine.score(signals),
    mergeProbability: mergeProbabilityEngine.score(signals),
  };
}

function computeOverallScore(breakdown: RecommendationBreakdown): number {
  const weights = RECOMMENDATION_WEIGHTS;
  const weighted =
    breakdown.learning.score * weights.learning +
    breakdown.aiRelevance.score * weights.aiRelevance +
    breakdown.maintainer.score * weights.maintainer +
    breakdown.impact.score * weights.impact +
    breakdown.mergeProbability.score * weights.mergeProbability;

  return clampScore(weighted);
}

export function scoreIssue(issue: Issue, category: string): Recommendation {
  const signals = extractSignals(issue, category);
  const breakdown = computeBreakdown(signals);
  const overallScore = computeOverallScore(breakdown);
  const explanation = generateExplanation(breakdown, RECOMMENDATION_WEIGHTS, overallScore);

  return {
    issueId: issue.id,
    issueNumber: issue.number,
    issueTitle: issue.title,
    issueUrl: issue.url,
    issueState: issue.state,
    issueLabels: issue.labels?.nodes.map((l) => ({ name: l.name, color: l.color })) ?? [],
    issueAuthor: issue.author?.login ?? "unknown",
    issueCreatedAt: issue.createdAt,
    repoFullName: issue.repository?.nameWithOwner ?? "",
    repoOwner: issue.repository?.owner.login ?? "",
    repoName: issue.repository?.name ?? "",
    repoLanguage: issue.repository?.primaryLanguage?.name ?? null,
    repoStars: 0,
    category,
    overallScore,
    breakdown,
    explanation,
  };
}

export function generateRecommendations(
  issues: Issue[],
  categoryMap: ReadonlyMap<string, string>,
): Recommendation[] {
  const recommendations = issues.map((issue) => {
    const repoKey = issue.repository?.nameWithOwner ?? "";
    const category = categoryMap.get(repoKey) ?? "Uncategorized";
    return scoreIssue(issue, category);
  });

  return recommendations.sort((a, b) => b.overallScore - a.overallScore);
}
