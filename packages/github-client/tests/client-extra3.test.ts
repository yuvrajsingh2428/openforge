import { describe, it, expect, vi } from 'vitest';
import { fetchGraphQL } from '../src/client';
import { GitHubAPIError } from '../src/errors';
import * as config from '../src/config';

describe('client extra coverage 3', () => {
  it('handles response ok false', async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({ GITHUB_TOKEN: 'token' });
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      headers: new Headers()
    });
    
    await expect(fetchGraphQL({ query: 'query' })).rejects.toThrow(GitHubAPIError);
  });
  
  it('handles graphql errors array', async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({ GITHUB_TOKEN: 'token' });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      json: async () => ({ errors: [{ message: 'Bad Query' }] })
    });
    
    await expect(fetchGraphQL({ query: 'query' })).rejects.toThrow(GitHubAPIError);
  });
  
  it('handles AbortError retry limit', async () => {
    vi.spyOn(config, 'getConfig').mockReturnValue({ GITHUB_TOKEN: 'token' });
    
    const err = new Error();
    err.name = 'AbortError';
    
    global.fetch = vi.fn().mockRejectedValue(err);
    
    await expect(fetchGraphQL({ query: 'query' }, 3)).rejects.toThrow();
  });
});
