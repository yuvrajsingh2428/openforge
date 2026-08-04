import { describe, it, expect } from "vitest";
import { parseIssueAnalysisResponse } from "../src/issue-analysis/response-parser";

describe("parseIssueAnalysisResponse", () => {
  const validJson = JSON.stringify({
    summary: "Refactor auth middleware",
    beginnerExplanation: "Simplifies token verification",
    whyItMatters: "Improves security and code readability",
    requiredSkills: ["Node.js", "JWT"],
    conceptsToLearn: ["Authentication Flows"],
    estimatedDifficulty: "Medium",
    estimatedHours: 4,
    confidence: 0.95,
    likelyFiles: ["src/middleware/auth.ts"],
    implementationStrategy: ["Extract token validation helper"],
    testingStrategy: ["Test expired token handling"],
    commonPitfalls: ["Not catching token parse errors"],
    learningResources: [{ title: "JWT Docs", reason: "Standard guide" }],
  });

  it("parses valid JSON response", () => {
    const result = parseIssueAnalysisResponse(validJson);
    expect(result.summary).toBe("Refactor auth middleware");
    expect(result.confidence).toBe(0.95);
    expect(result.estimatedHours).toBe(4);
  });

  it("strips markdown code fences if present", () => {
    const markdownWrapped = "```json\n" + validJson + "\n```";
    const result = parseIssueAnalysisResponse(markdownWrapped);
    expect(result.summary).toBe("Refactor auth middleware");
  });

  it("clamps out-of-range confidence values", () => {
    const invalidConfidence = JSON.stringify({
      ...JSON.parse(validJson),
      confidence: 1.5,
    });
    const result = parseIssueAnalysisResponse(invalidConfidence);
    expect(result.confidence).toBe(1.0);
  });

  it("throws AIResponseParseError on unparseable string", () => {
    expect(() => parseIssueAnalysisResponse("Not JSON at all")).toThrow();
  });
});
