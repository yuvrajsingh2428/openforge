import { describe, it, expect } from "vitest";
import { learningEngine } from "../src/engines/learning";
import { aiRelevanceEngine } from "../src/engines/ai-relevance";
import { maintainerEngine } from "../src/engines/maintainer";
import { impactEngine } from "../src/engines/impact";
import { mergeProbabilityEngine } from "../src/engines/merge-probability";
import { generateExplanation } from "../src/engines/explanation";
import { scoreIssue } from "../src/services/recommendation-service";
import { RECOMMENDATION_WEIGHTS } from "@openforge/config";
import type { ScoringSignals, RecommendationBreakdown } from "../src/types";

function createSignals(overrides: Partial<ScoringSignals> = {}): ScoringSignals {
  return {
    issueTitle: "Add streaming support for agent responses",
    issueBody: "We need to implement streaming for LLM agent responses. This involves refactoring the API layer and adding test coverage.",
    issueState: "OPEN",
    issueLabels: ["enhancement", "good first issue", "help wanted"],
    issueLabelColors: [
      { name: "enhancement", color: "a2eeef" },
      { name: "good first issue", color: "7057ff" },
      { name: "help wanted", color: "008672" },
    ],
    issueCreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    issueUpdatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    issueClosedAt: null,
    issueCommentCount: 5,
    issueReactionCount: 8,
    issueAssigneeCount: 0,
    issueAuthor: "testuser",
    issueMilestone: "v2.0",
    issueUrl: "https://github.com/test/repo/issues/42",
    issueNumber: 42,
    repoName: "repo",
    repoFullName: "test/repo",
    repoOwner: "test",
    repoStars: 15000,
    repoForks: 3000,
    repoOpenIssues: 200,
    repoLanguage: "TypeScript",
    repoTopics: ["ai", "agent", "typescript"],
    repoUpdatedAt: new Date(),
    repoHasLicense: true,
    repoDescription: "An AI agent framework",
    category: "Frontend",
    ...overrides,
  };
}

describe("Learning Engine", () => {
  it("scores higher for detailed issues with test mentions", () => {
    const signals = createSignals();
    const result = learningEngine.score(signals);
    expect(result.score).toBeGreaterThan(50);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
  });

  it("scores lower for sparse issues", () => {
    const signals = createSignals({ issueBody: "Fix typo", issueLabels: [] });
    const result = learningEngine.score(signals);
    expect(result.score).toBeLessThan(60);
  });
});

describe("AI Relevance Engine", () => {
  it("scores high for AI-related content", () => {
    const signals = createSignals();
    const result = aiRelevanceEngine.score(signals);
    expect(result.score).toBeGreaterThan(60);
    expect(result.reasons.some((r) => r.toLowerCase().includes("ai"))).toBe(true);
  });

  it("scores low for non-AI content", () => {
    const signals = createSignals({
      issueTitle: "Fix CSS layout",
      issueBody: "The sidebar overflows on mobile",
      repoTopics: ["css", "frontend"],
      repoDescription: "A CSS framework",
    });
    const result = aiRelevanceEngine.score(signals);
    expect(result.score).toBeLessThan(30);
  });
});

describe("Maintainer Friendliness Engine", () => {
  it("scores high for well-labeled issues", () => {
    const signals = createSignals();
    const result = maintainerEngine.score(signals);
    expect(result.score).toBeGreaterThan(60);
    expect(result.reasons.some((r) => r.includes("good first issue") || r.includes("newcomers"))).toBe(true);
  });

  it("scores lower for poorly described issues", () => {
    const signals = createSignals({ issueBody: "Fix it", issueLabels: [], issueCommentCount: 0 });
    const result = maintainerEngine.score(signals);
    expect(result.score).toBeLessThan(50);
  });
});

describe("Impact Engine", () => {
  it("scores high for popular repos with reactions", () => {
    const signals = createSignals();
    const result = impactEngine.score(signals);
    expect(result.score).toBeGreaterThan(50);
  });

  it("scores lower for small repos", () => {
    const signals = createSignals({ repoStars: 50, repoForks: 5, issueReactionCount: 0 });
    const result = impactEngine.score(signals);
    expect(result.score).toBeLessThan(40);
  });
});

describe("Merge Probability Engine", () => {
  it("scores high for fresh open issues", () => {
    const signals = createSignals();
    const result = mergeProbabilityEngine.score(signals);
    expect(result.score).toBeGreaterThan(60);
  });

  it("penalizes closed issues", () => {
    const signals = createSignals({ issueState: "CLOSED" });
    const result = mergeProbabilityEngine.score(signals);
    const openSignals = createSignals();
    const openResult = mergeProbabilityEngine.score(openSignals);
    expect(result.score).toBeLessThan(openResult.score);
  });

  it("penalizes old issues", () => {
    const signals = createSignals({
      issueCreatedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      issueUpdatedAt: null,
    });
    const result = mergeProbabilityEngine.score(signals);
    expect(result.score).toBeLessThan(70);
  });
});

describe("Explanation Engine", () => {
  it("generates a summary and factor breakdown", () => {
    const breakdown: RecommendationBreakdown = {
      learning: { score: 80, reasons: ["High architectural exposure"], confidence: 0.8 },
      aiRelevance: { score: 90, reasons: ["Strong AI focus"], confidence: 0.9 },
      maintainer: { score: 70, reasons: ["Maintainers welcome newcomers"], confidence: 0.7 },
      impact: { score: 60, reasons: ["Popular repository"], confidence: 0.8 },
      mergeProbability: { score: 75, reasons: ["Recently created issue"], confidence: 0.7 },
    };

    const explanation = generateExplanation(breakdown, RECOMMENDATION_WEIGHTS, 78);
    expect(explanation.summary).toBeTruthy();
    expect(explanation.factors.length).toBe(5);
    expect(explanation.factors[0].weightedScore).toBeGreaterThan(0);
  });
});

describe("Recommendation Service", () => {
  it("produces a deterministic recommendation from an issue", () => {
    const issue = {
      id: "issue-1",
      number: 42,
      title: "Add streaming support for agent responses",
      body: "We need to implement streaming for LLM agent responses with test coverage.",
      state: "OPEN",
      url: "https://github.com/test/repo/issues/42",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      closedAt: null,
      author: { login: "testuser", avatarUrl: "https://avatars.com/u/1" },
      labels: { nodes: [{ name: "enhancement", color: "a2eeef" }, { name: "good first issue", color: "7057ff" }] },
      comments: { totalCount: 5 },
      reactions: { totalCount: 8 },
      assignees: { nodes: [] },
      milestone: { title: "v2.0" },
      repository: {
        name: "repo",
        nameWithOwner: "test/repo",
        owner: { login: "test", avatarUrl: "https://avatars.com/u/2" },
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      },
    };

    const rec = scoreIssue(issue, "Frontend");

    expect(rec.overallScore).toBeGreaterThan(0);
    expect(rec.overallScore).toBeLessThanOrEqual(100);
    expect(rec.breakdown.learning.score).toBeGreaterThan(0);
    expect(rec.breakdown.aiRelevance.score).toBeGreaterThan(0);
    expect(rec.explanation.summary).toBeTruthy();
    expect(rec.explanation.factors.length).toBe(5);

    // Determinism: running again should produce identical results
    const rec2 = scoreIssue(issue, "Frontend");
    expect(rec2.overallScore).toBe(rec.overallScore);
    expect(rec2.breakdown.learning.score).toBe(rec.breakdown.learning.score);
  });
});
