/**
 * Base error class for all AI provider errors.
 * Never includes API keys or secrets in error messages.
 */
export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}

/** Thrown on 401 or 403 responses — invalid or missing credentials. */
export class AIAuthenticationError extends AIProviderError {
  constructor(provider: string, statusCode: number = 401) {
    super(
      `Authentication failed for provider "${provider}". Check your API key configuration.`,
      provider,
      statusCode,
      false,
    );
    this.name = "AIAuthenticationError";
  }
}

/** Thrown on 429 responses — rate limit exceeded. */
export class AIRateLimitError extends AIProviderError {
  constructor(provider: string, public readonly retryAfterMs?: number) {
    super(
      `Rate limit exceeded for provider "${provider}". Please retry later.`,
      provider,
      429,
      true,
    );
    this.name = "AIRateLimitError";
  }
}

/** Thrown on 404 responses — model or endpoint not found. */
export class AIModelNotFoundError extends AIProviderError {
  constructor(provider: string, model: string) {
    super(
      `Model "${model}" not found on provider "${provider}". Check your model configuration.`,
      provider,
      404,
      false,
    );
    this.name = "AIModelNotFoundError";
  }
}

/** Thrown when a request times out. */
export class AITimeoutError extends AIProviderError {
  constructor(provider: string, timeoutMs: number) {
    super(
      `Request to provider "${provider}" timed out after ${timeoutMs}ms.`,
      provider,
      undefined,
      true,
    );
    this.name = "AITimeoutError";
  }
}

/** Thrown on network-level failures (DNS, connection refused, etc.). */
export class AINetworkError extends AIProviderError {
  constructor(provider: string, cause?: string) {
    super(
      `Network error connecting to provider "${provider}"${cause ? `: ${cause}` : ""}.`,
      provider,
      undefined,
      true,
    );
    this.name = "AINetworkError";
  }
}

/** Thrown when the provider returns a response that cannot be parsed as valid JSON. */
export class AIResponseParseError extends AIProviderError {
  constructor(provider: string, cause?: string) {
    super(
      `Failed to parse response from provider "${provider}"${cause ? `: ${cause}` : ""}.`,
      provider,
      undefined,
      false,
    );
    this.name = "AIResponseParseError";
  }
}
