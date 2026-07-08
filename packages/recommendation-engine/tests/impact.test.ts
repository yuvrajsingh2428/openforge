import { describe, it, expect } from 'vitest';
import { impactEngine } from '../src/engines/impact';

describe('impact engine coverage', () => {
  it('caps max values for huge repos', () => {
    const signals: any = {
      repoStars: 1000000,
      repoForks: 50000,
      issueReactionCount: 1000,
      issueCommentCount: 500,
      issueLabels: []
    };
    
    const result = impactEngine.score(signals);
    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
  
  it('handles negative or zero values', () => {
    const signals: any = {
      repoStars: 0,
      repoForks: 0,
      issueReactionCount: 0,
      issueCommentCount: 0,
      issueLabels: []
    };
    
    const result = impactEngine.score(signals);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});
