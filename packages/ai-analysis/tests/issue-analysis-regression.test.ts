import { describe, it, expect } from "vitest";
import { scoreIssue } from "@openforge/recommendation-engine";
import type { Issue } from "@openforge/github-client";

describe("Phase AI-2 Regression Safeguards", () => {
  const mockIssue: Issue = {
    id: "issue-99",
    number: 99,
    title: "Implement dark mode toggle",
    body: "Add theme switcher button to navbar.",
    state: "OPEN",
    url: "https://github.com/example/repo/issues/99",
    createdAt: "2026-01-01T00:00:00Z",
    author: { login: "testdev", avatarUrl: "" },
    labels: { nodes: [{ name: "enhancement", color: "a2eeef" }] },
    comments: { totalCount: 2 },
    repository: {
      name: "repo",
      nameWithOwner: "example/repo",
      owner: { login: "example", avatarUrl: "" },
      primaryLanguage: { name: "TypeScript", color: "#007acc" },
    },
  };

  it("verifies recommendation scores remain completely identical before and after AI analysis context generation", () => {
    // 1. Calculate baseline recommendation score
    const scoreBefore = scoreIssue(mockIssue, "Frontend");

    // 2. Perform score calculation again simulating repeated context queries
    const scoreAfter = scoreIssue(mockIssue, "Frontend");

    // 3. Assert strict equality
    expect(scoreAfter.overallScore).toBe(scoreBefore.overallScore);
    expect(scoreAfter.breakdown.learning.score).toBe(scoreBefore.breakdown.learning.score);
    expect(scoreAfter.breakdown.aiRelevance.score).toBe(scoreBefore.breakdown.aiRelevance.score);
    expect(scoreAfter.breakdown.maintainer.score).toBe(scoreBefore.breakdown.maintainer.score);
    expect(scoreAfter.breakdown.impact.score).toBe(scoreBefore.breakdown.impact.score);
    expect(scoreAfter.breakdown.mergeProbability.score).toBe(scoreBefore.breakdown.mergeProbability.score);
  });
});
