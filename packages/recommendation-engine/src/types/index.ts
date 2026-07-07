import type { Issue, Repository } from "@openforge/github-client";

/** Normalized signals extracted from an issue and its repository */
export interface ScoringSignals {
  readonly issueTitle: string;
  readonly issueBody: string;
  readonly issueState: string;
  readonly issueLabels: ReadonlyArray<string>;
  readonly issueLabelColors: ReadonlyArray<{ name: string; color: string }>;
  readonly issueCreatedAt: Date;
  readonly issueUpdatedAt: Date | null;
  readonly issueClosedAt: Date | null;
  readonly issueCommentCount: number;
  readonly issueReactionCount: number;
  readonly issueAssigneeCount: number;
  readonly issueAuthor: string;
  readonly issueMilestone: string | null;
  readonly issueUrl: string;
  readonly issueNumber: number;
  readonly repoName: string;
  readonly repoFullName: string;
  readonly repoOwner: string;
  readonly repoStars: number;
  readonly repoForks: number;
  readonly repoOpenIssues: number;
  readonly repoLanguage: string | null;
  readonly repoTopics: ReadonlyArray<string>;
  readonly repoUpdatedAt: Date | null;
  readonly repoHasLicense: boolean;
  readonly repoDescription: string;
  readonly category: string;
}

/** Score produced by a single scoring engine (0–100) */
export interface FactorScore {
  readonly score: number;
  readonly reasons: ReadonlyArray<string>;
  readonly confidence: number;
}

/** Breakdown of all factor scores for a recommendation */
export interface RecommendationBreakdown {
  readonly learning: FactorScore;
  readonly aiRelevance: FactorScore;
  readonly maintainer: FactorScore;
  readonly impact: FactorScore;
  readonly mergeProbability: FactorScore;
}

/** Human-readable explanation for a recommendation */
export interface RecommendationExplanation {
  readonly summary: string;
  readonly factors: ReadonlyArray<{
    readonly name: string;
    readonly score: number;
    readonly weight: number;
    readonly weightedScore: number;
    readonly topReason: string;
  }>;
}

/** A single full recommendation */
export interface Recommendation {
  readonly issueId: string;
  readonly issueNumber: number;
  readonly issueTitle: string;
  readonly issueUrl: string;
  readonly issueState: string;
  readonly issueLabels: ReadonlyArray<{ name: string; color: string }>;
  readonly issueAuthor: string;
  readonly issueCreatedAt: string;
  readonly repoFullName: string;
  readonly repoOwner: string;
  readonly repoName: string;
  readonly repoLanguage: string | null;
  readonly repoStars: number;
  readonly category: string;
  readonly overallScore: number;
  readonly breakdown: RecommendationBreakdown;
  readonly explanation: RecommendationExplanation;
}

/** Interface for a scoring engine */
export interface ScoringEngine {
  readonly name: string;
  score(signals: ScoringSignals): FactorScore;
}
