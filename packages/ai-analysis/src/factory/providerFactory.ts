import { AI_CONFIG } from "@openforge/config";
import type { AIProvider } from "../types";
import { OllamaProvider } from "../providers/ollama";
import { OpenRouterProvider } from "../providers/openrouter";

/**
 * Create an AI provider instance based on the provider name.
 *
 * Uses `AI_PROVIDER` environment variable by default.
 * Supported values: "ollama", "openrouter".
 *
 * @param providerName - Override the provider name (defaults to AI_CONFIG.provider)
 * @returns An AIProvider instance
 * @throws Error if the provider name is not recognized
 */
export function createAIProvider(providerName?: string): AIProvider {
  const name = providerName ?? AI_CONFIG.provider;
  switch (name) {
    case "ollama":
      return new OllamaProvider();
    case "openrouter":
      return new OpenRouterProvider();
    default:
      throw new Error(
        `Unknown AI provider "${name}". ` +
        `Supported providers: ollama, openrouter. ` +
        `Set AI_PROVIDER environment variable to a valid value.`,
      );
  }
}
