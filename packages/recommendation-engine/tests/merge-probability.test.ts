import { describe, it, expect } from 'vitest';
import { mergeProbabilityEngine } from '../src/engines/merge-probability';

describe('merge-probability engine coverage', () => {
  it('handles negative branch inputs', () => {
    const signals: any = {
      issueState: 'CLOSED',
      issueClosedAt: new Date(),
      issueCreatedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      issueUpdatedAt: null,
      issueCommentCount: 50,
      issueReactionCount: 0,
      issueLabels: []
    };
    
    const result = mergeProbabilityEngine.score(signals);
    expect(result.score).toBeDefined();
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
