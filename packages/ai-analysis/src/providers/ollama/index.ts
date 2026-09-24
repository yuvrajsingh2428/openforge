import { AI_CONFIG } from "@openforge/config";
import type { AIProvider, AIAvailabilityResult, AIChatMessage, AIRawResponse } from "../../types";
import {
  AIProviderError,
  AITimeoutError,
  AINetworkError,
  AIResponseParseError,
} from "../../errors";

export class OllamaProvider implements AIProvider {
  readonly name = "ollama";
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly defaultTimeout: number;
  private readonly retryCount: number;

  constructor(config?: {
    baseUrl?: string;
    model?: string;
    timeoutMs?: number;
    retryCount?: number;
  }) {
    this.baseUrl = config?.baseUrl ?? AI_CONFIG.ollamaBaseUrl;
    this.model = config?.model ?? AI_CONFIG.model;
    this.defaultTimeout = config?.timeoutMs ?? AI_CONFIG.timeoutMs;
    this.retryCount = config?.retryCount ?? AI_CONFIG.retryCount;
  }

  async isAvailable(): Promise<AIAvailabilityResult> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return {
          available: false,
          provider: this.name,
          model: null,
          message: `Ollama responded with status ${response.status}`,
        };
      }

      const data = (await response.json()) as { models?: { name: string }[] };
      const models = data.models ?? [];
      const hasModel = models.some((m) => m.name.startsWith(this.model));

      return {
        available: hasModel,
        provider: this.name,
        model: hasModel ? this.model : null,
        message: hasModel
          ? `Ollama is available with model ${this.model}`
          : `Ollama is running but model ${this.model} is not installed. Run: ollama pull ${this.model}`,
      };
    } catch {
      return {
        available: false,
        provider: this.name,
        model: null,
        message: "Ollama is not running. Start Ollama locally to enable AI analysis.",
      };
    }
  }

  async chat(
    messages: AIChatMessage[],
    options?: { temperature?: number; timeoutMs?: number }
  ): Promise<AIRawResponse> {
    const temperature = options?.temperature ?? AI_CONFIG.temperature;
    const timeoutMs = options?.timeoutMs ?? this.defaultTimeout;

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const start = Date.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const response = await fetch(`${this.baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: this.model,
            messages: messages.map((m) => ({ role: m.role, content: m.content })),
            stream: false,
            options: { temperature },
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) {
          throw new AIProviderError(
            `Ollama responded with status ${response.status}`,
            this.name,
            response.status,
            response.status >= 500
          );
        }

        let data: { message?: { content?: string }; model?: string };
        try {
          data = await response.json();
        } catch {
          throw new AIResponseParseError(this.name, "Response is not valid JSON");
        }

        const content = data.message?.content ?? "";
        const durationMs = Date.now() - start;

        return {
          content,
          model: data.model ?? this.model,
          durationMs,
        };
      } catch (error) {
        // Non-retryable typed errors bubble immediately
        if (error instanceof AIProviderError && !error.retryable) {
          throw error;
        }

        // Timeout detection (works in both Node.js and browser)
        if (
          error instanceof Error &&
          (error.name === "AbortError" || (error as any).code === "ABORT_ERR")
        ) {
          lastError = new AITimeoutError(this.name, timeoutMs);
          if (attempt < this.retryCount) {
            await this.backoff(attempt);
            continue;
          }
          throw lastError;
        }

        // Network errors
        if (
          error instanceof TypeError &&
          (error.message.includes("fetch") || error.message.includes("network"))
        ) {
          lastError = new AINetworkError(this.name, error.message);
          if (attempt < this.retryCount) {
            await this.backoff(attempt);
            continue;
          }
          throw lastError;
        }

        // Retryable typed errors
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

    throw lastError ?? new AIProviderError("Ollama chat failed after retries", this.name);
  }

  /** Exponential backoff: 1s, 2s, 4s, ... */
  private backoff(attempt: number): Promise<void> {
    const delay = Math.min(1000 * Math.pow(2, attempt), 10_000);
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}
