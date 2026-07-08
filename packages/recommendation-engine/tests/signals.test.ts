import { describe, it, expect } from 'vitest';
import { extractSignals } from '../src/utils/signals';

describe('signals utility', () => {
  it('handles null nodes and missing repositories', () => {
    const rawIssue: any = {
      title: 'test',
      body: 'test body',
      state: 'OPEN',
      labels: { nodes: [{ name: null }, { name: undefined }] },
      author: null,
      assignees: null,
      repository: null,
      comments: null,
      reactions: null
    };

    const signals = extractSignals(rawIssue, 'Backend');
    
    expect(signals.issueAuthor).toBeDefined();
    expect(signals.repoName).toBeDefined();
    expect(signals.issueCommentCount).toBe(0);
    expect(signals.issueAssigneeCount).toBe(0);
    expect(signals.issueReactionCount).toBe(0);
  });
});
