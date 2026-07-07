import { getConfig } from "./config";
import { AuthenticationError, GitHubAPIError, RateLimitError } from "./errors";
import { GraphQLRequestOptions } from "./types/graphql";

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 3;

export async function fetchGraphQL<T>(options: GraphQLRequestOptions, retries = 0): Promise<T> {
  const { GITHUB_TOKEN } = getConfig();
  const { query, variables, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new AuthenticationError();
    }

    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    const rateLimitReset = response.headers.get("x-ratelimit-reset");

    if (response.status === 403 && rateLimitRemaining === "0") {
      const resetAt = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000) : new Date();
      throw new RateLimitError(resetAt, 0);
    }

    if (!response.ok) {
      throw new GitHubAPIError(
        `GitHub API error: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new GitHubAPIError(
        `GraphQL error: ${data.errors[0].message}`,
        200,
        data.errors
      );
    }

    return data.data as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError" && retries < MAX_RETRIES) {
      return fetchGraphQL(options, retries + 1);
    }
    
    // Auto-retry transient network errors
    if (error instanceof TypeError && error.message.includes('fetch') && retries < MAX_RETRIES) {
      return fetchGraphQL(options, retries + 1);
    }

    throw error;
  }
}
