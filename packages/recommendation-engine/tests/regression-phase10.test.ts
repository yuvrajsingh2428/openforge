import { describe, it, expect } from "vitest";
import { scoreIssue } from "../src/services/recommendation-service";

describe("Phase 10 Regression Tests", () => {
  it("proves recommendation scores remain completely unchanged after Phase 10 AI Mentor integration", () => {
    const issue = {
      id: "issue-1",
      number: 42,
      title: "Add streaming support for agent responses",
      body: "We need to implement streaming for LLM agent responses with test coverage.",
      state: "OPEN",
      url: "https://github.com/test/repo/issues/42",
      createdAt: new Date("2026-06-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2026-06-05T00:00:00Z").toISOString(),
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

    const rec = scoreIssue(issue as any, "Frontend");

    // The score must be deterministic and exactly match the value prior to Phase 10.
    // Assert it is exactly the same as evaluated previously (54).
    expect(rec.overallScore).toBe(54);
  });
});
