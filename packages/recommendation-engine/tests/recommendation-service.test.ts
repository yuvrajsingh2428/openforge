import { describe, it, expect } from 'vitest';
import { scoreIssue } from '../src/services/recommendation-service';

describe('recommendation-service coverage', () => {
  it('handles low quality issues with minimum scores', () => {
    const rawIssue: any = {
      id: "issue-junk",
      number: 1,
      title: "",
      body: "",
      state: "CLOSED",
      url: "https://github.com/test/repo/issues/1",
      createdAt: new Date("2010-01-01T00:00:00Z").toISOString(),
      updatedAt: new Date("2010-01-01T00:00:00Z").toISOString(),
      closedAt: new Date("2010-01-02T00:00:00Z").toISOString(),
      author: null,
      labels: { nodes: [] },
      comments: null,
      reactions: null,
      assignees: null,
      repository: {
        name: "junk",
        nameWithOwner: "test/junk",
        owner: { login: "test", avatarUrl: "" },
        primaryLanguage: null,
      },
    };

    const result = scoreIssue(rawIssue, "Backend");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.explanation.summary).toBeTruthy();
  });
});
