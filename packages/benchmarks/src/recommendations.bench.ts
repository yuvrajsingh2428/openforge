import { bench, describe } from 'vitest';
import { scoreIssue } from '@openforge/recommendation-engine/src/services/recommendation-service';

describe('Recommendation Engine Performance', () => {
  const issue = {
    id: "issue-1",
    number: 42,
    title: "Add streaming support for agent responses",
    body: "We need to implement streaming for LLM agent responses with test coverage.",
    state: "OPEN",
    url: "https://github.com/test/repo/issues/42",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    closedAt: null,
    author: { login: "testuser", avatarUrl: "https://avatars.com/u/1" },
    labels: { nodes: [{ name: "enhancement", color: "a2eeef" }] },
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

  bench('scoreIssue', () => {
    scoreIssue(issue as any, "Frontend");
  });
});
