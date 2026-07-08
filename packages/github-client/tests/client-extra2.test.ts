import { describe, it, expect } from 'vitest';
import { extractPageInfo } from '../src/utils/pagination';

describe('client extra coverage 2', () => {
  it('extractPageInfo handles null nodes', () => {
    const data = extractPageInfo({ pageInfo: null } as any);
    expect(data.hasNextPage).toBe(false);
    expect(data.endCursor).toBeNull();
  });
  
  it('extractPageInfo handles empty object', () => {
    const data = extractPageInfo({});
    expect(data.hasNextPage).toBe(false);
    expect(data.endCursor).toBeNull();
  });
});
