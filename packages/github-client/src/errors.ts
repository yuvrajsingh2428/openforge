export class GitHubAPIError extends Error {
  constructor(message: string, public statusCode?: number, public response?: any) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export class RateLimitError extends GitHubAPIError {
  constructor(public resetAt: Date, public limit: number) {
    super("GitHub API rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class AuthenticationError extends GitHubAPIError {
  constructor() {
    super("GitHub API authentication failed. Check your GITHUB_TOKEN.");
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends Error {
  constructor(message: string, public issues?: any) {
    super(message);
    this.name = "ValidationError";
  }
}
