import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../src/services/recommendation-service';

describe('generateRecommendations', () => {
  it('generates recommendations and sorts them', () => {
    const issues: any[] = [
      {
        id: "1", number: 1, title: "A", body: "", state: "OPEN", url: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), closedAt: null,
        author: { login: 'test' }, labels: { nodes: [] }, comments: null, reactions: null, assignees: null,
        repository: { name: "repo1", nameWithOwner: "test/repo1", owner: { login: 'test' } }
      },
      {
        id: "2", number: 2, title: "B", body: "", state: "OPEN", url: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), closedAt: null,
        author: null, labels: null, comments: null, reactions: null, assignees: null,
        repository: null
      }
    ];
    
    const categoryMap = new Map([["test/repo1", "Frontend"]]);
    
    const recs = generateRecommendations(issues, categoryMap);
    expect(recs.length).toBe(2);
    expect(recs[0].overallScore).toBeGreaterThanOrEqual(recs[1].overallScore);
    expect(recs.find(r => r.issueId === "1")?.category).toBe("Frontend");
    expect(recs.find(r => r.issueId === "2")?.category).toBe("Uncategorized");
  });
});
