import { AI_CONFIG } from "@openforge/config";
import type { AIProvider, AIAvailabilityResult, AIChatMessage, AIRawResponse } from "../../types";
import {
  AIProviderError,
  AIAuthenticationError,
  AIRateLimitError,
  AIModelNotFoundError,
  AITimeoutError,
  AINetworkError,
  AIResponseParseError,
} from "../../errors";

/** OpenAI-compatible chat completion response shape. */
interface OpenRouterChatResponse {
  id?: string;
  choices?: Array<{
    message?: { content?: string };
    finish_reason?: string;
  }>;
  model?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

export class OpenRouterProvider implements AIProvider {
  readonly name = "openrouter";
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly httpReferer: string;
  private readonly appName: string;
  private readonly defaultTimeout: number;
  private readonly retryCount: number;

  constructor(config?: {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    httpReferer?: string;
    appName?: string;
    timeoutMs?: number;
    retryCount?: number;
  }) {
    this.apiKey = config?.apiKey ?? AI_CONFIG.openrouter.apiKey;
    this.baseUrl = config?.baseUrl ?? AI_CONFIG.openrouter.baseUrl;
    this.model = config?.model ?? AI_CONFIG.openrouter.model;
    this.httpReferer = config?.httpReferer ?? AI_CONFIG.openrouter.httpReferer;
    this.appName = config?.appName ?? AI_CONFIG.openrouter.appName;
    this.defaultTimeout = config?.timeoutMs ?? AI_CONFIG.timeoutMs;
    this.retryCount = config?.retryCount ?? AI_CONFIG.retryCount;
  }

  async isAvailable(): Promise<AIAvailabilityResult> {
    if (!this.apiKey) {
      return {
        available: false,
        provider: this.name,
        model: null,
        message: "OpenRouter API key is not configured. Set OPENROUTER_API_KEY in your environment.",
      };
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);

      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": this.httpReferer,
          "X-Title": this.appName,
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.status === 401 || response.status === 403) {
        return {
          available: false,
          provider: this.name,
          model: null,
          message: "OpenRouter API key is invalid. Check your OPENROUTER_API_KEY configuration.",
        };
      }

      if (!response.ok) {
        return {
          available: false,
          provider: this.name,
          model: null,
          message: `OpenRouter responded with status ${response.status}.`,
        };
      }

      return {
        available: true,
        provider: this.name,
        model: this.model,
        message: `OpenRouter is available with model ${this.model}.`,
      };
    } catch {
      return {
        available: false,
        provider: this.name,
        model: null,
        message: "Failed to connect to OpenRouter. Check your network and OPENROUTER_BASE_URL.",
      };
    }
  }

  async chat(
    messages: AIChatMessage[],
    options?: { temperature?: number; timeoutMs?: number },
  ): Promise<AIRawResponse> {
    if (!this.apiKey) {
      throw new AIAuthenticationError(this.name);
    }

    const temperature = options?.temperature ?? AI_CONFIG.temperature;
    const timeoutMs = options?.timeoutMs ?? this.defaultTimeout;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const start = Date.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`,
            "HTTP-Referer": this.httpReferer,
            "X-Title": this.appName,
          },
          body: JSON.stringify({
            model: this.model,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            temperature,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          this.handleErrorResponse(response.status);
        }

        let data: OpenRouterChatResponse;
        try {
          data = await response.json() as OpenRouterChatResponse;
        } catch {
          throw new AIResponseParseError(this.name, "Response is not valid JSON");
        }

        const content = data.choices?.[0]?.message?.content ?? "";
        if (!content) {
          throw new AIResponseParseError(this.name, "Response contains no content");
        }

        const durationMs = Date.now() - start;

        return {
          content,
          model: data.model ?? this.model,
          durationMs,
        };
      } catch (error) {
        if (error instanceof AIProviderError && !error.retryable) {
          throw error;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
          lastError = new AITimeoutError(this.name, timeoutMs);
          if (attempt < this.retryCount) {
            await this.backoff(attempt);
            continue;
          }
          throw lastError;
        }

        if (error instanceof TypeError && (error.message.includes("fetch") || error.message.includes("network"))) {
          lastError = new AINetworkError(this.name, error.message);
          if (attempt < this.retryCount) {
            await this.backoff(attempt);
            continue;
          }
          throw lastError;
        }

        if (error instanceof AIProviderError && error.retryable) {
          lastError = error;
          if (attempt < this.retryCount) {
            await this.backoff(attempt);
            continue;
          }
          throw error;
        }

        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.retryCount) {
          await this.backoff(attempt);
          continue;
        }
      }
    }

    throw lastError ?? new AIProviderError("OpenRouter chat failed after retries", this.name);
  }

  /** Map HTTP status codes to typed errors. Always throws. */
  private handleErrorResponse(status: number): never {
    switch (status) {
      case 401:
      case 403:
        throw new AIAuthenticationError(this.name, status);
      case 404:
        throw new AIModelNotFoundError(this.name, this.model);
      case 429:
        throw new AIRateLimitError(this.name);
      default:
        throw new AIProviderError(
          `OpenRouter responded with status ${status}`,
          this.name,
          status,
          status >= 500,
        );
    }
  }

  /** Exponential backoff: 1s, 2s, 4s, ... */
  private backoff(attempt: number): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, attempt), 10_000);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
