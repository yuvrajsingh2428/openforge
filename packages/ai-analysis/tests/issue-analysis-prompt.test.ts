import { describe, it, expect } from "vitest";
import { buildIssueAnalysisPrompt } from "../src/prompts/issue-analysis";
import type { IssueAnalysisContext } from "../src/issue-analysis/context-builder";

describe("buildIssueAnalysisPrompt", () => {
  const mockContext: IssueAnalysisContext = {
    title: "Fix Memory Leak",
    body: "Detailed description of memory leak...",
    labels: ["bug", "performance"],
    commentCount: 5,
    author: "dev1",
    state: "OPEN",
    repoFullName: "facebook/react",
    repoLanguage: "JavaScript",
    architecture: ["Monorepo"],
    dependencies: ["jest", "babel"],
    entryPoints: ["packages/react/index.js"],
    modules: ["packages/react", "packages/react-dom"],
    testDirectories: [],
    overallScore: 88,
    learningScore: 92,
    aiRelevanceScore: 85,
    maintainerScore: 90,
  };

  it("returns system and user messages", () => {
    const messages = buildIssueAnalysisPrompt(mockContext);
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("system");
    expect(messages[1].role).toBe("user");
  });

  it("includes strict safety rules in system prompt", () => {
    const messages = buildIssueAnalysisPrompt(mockContext);
    const systemContent = messages[0].content;
    expect(systemContent).toContain("Never generate code.");
    expect(systemContent).toContain("Never generate patches.");
    expect(systemContent).toContain("Never generate pull requests.");
  });

  it("injects context data into user prompt", () => {
    const messages = buildIssueAnalysisPrompt(mockContext);
    const userContent = messages[1].content;
    expect(userContent).toContain("facebook/react");
    expect(userContent).toContain("Fix Memory Leak");
    expect(userContent).toContain("Overall Recommendation Score: 88/100");
  });
});
