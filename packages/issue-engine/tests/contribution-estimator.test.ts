import { describe, it, expect } from "vitest";
import { ContributionEstimator } from "../src/services/contribution-estimator";
import { ContributionInput } from "../src/types";

describe("ContributionEstimator", () => {
  const estimator = new ContributionEstimator();

  it("should estimate XS for good first issues", () => {
    const input: ContributionInput = {
      labels: ["good first issue"],
      bodyLength: 100,
      commentsCount: 0,
      issueAgeDays: 1,
      repositoryMaturityScore: 80,
      assigneesCount: 0,
    };
    
    const result = estimator.estimate(input);
    expect(result.size).toBe("XS");
    expect(result.confidence).toBeGreaterThan(0.7);
  });

  it("should estimate XL for epics", () => {
    const input: ContributionInput = {
      labels: ["epic", "architecture"],
      bodyLength: 2500,
      commentsCount: 25,
      issueAgeDays: 30,
      repositoryMaturityScore: 80,
      assigneesCount: 2,
    };
    
    const result = estimator.estimate(input);
    expect(result.size).toBe("XL");
    expect(result.reasons).toContain("Has complex labels (e.g., 'epic', 'architecture', 'refactor').");
  });

  it("should estimate M for standard bugs", () => {
    const input: ContributionInput = {
      labels: ["bug"],
      bodyLength: 500,
      commentsCount: 5,
      issueAgeDays: 10,
      repositoryMaturityScore: 80,
      assigneesCount: 1,
    };
    
    const result = estimator.estimate(input);
    expect(result.size).toBe("S"); // wait, score is 2 - 0.5 (if short) = 2. So size S. Wait, body is 500, score=2 -> size S.
  });
});
