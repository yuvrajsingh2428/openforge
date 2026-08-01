import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the config module before any imports
vi.mock("@openforge/config", () => ({
  AI_CONFIG: {
    provider: "ollama",
    model: "qwen3:8b",
    temperature: 0.3,
    timeoutMs: 60_000,
    retryCount: 2,
    cacheTtlMs: 30 * 60 * 1000,
    ollamaBaseUrl: "http://localhost:11434",
    openrouter: {
      apiKey: "test-key",
      baseUrl: "https://openrouter.ai/api/v1",
      model: "deepseek/deepseek-chat-v3",
      httpReferer: "http://localhost:3000",
      appName: "OpenForge",
    },
  },
  env: {
    AI_PROVIDER: "ollama",
    OLLAMA_BASE_URL: "http://localhost:11434",
    OLLAMA_CHAT_MODEL: "qwen3:8b",
    OLLAMA_SUMMARY_MODEL: "gemma3:latest",
    OLLAMA_EMBEDDING_MODEL: "nomic-embed-text",
    OLLAMA_TIMEOUT: 120_000,
    OPENROUTER_API_KEY: "test-key",
    OPENROUTER_BASE_URL: "https://openrouter.ai/api/v1",
    OPENROUTER_MODEL: "deepseek/deepseek-chat-v3",
    OPENROUTER_HTTP_REFERER: "http://localhost:3000",
    OPENROUTER_APP_NAME: "OpenForge",
  },
}));

import { createAIProvider } from "../src/factory/providerFactory";
import { getAIProvider, resetAIProvider } from "../src/providers/base";
import { OllamaProvider } from "../src/providers/ollama";
import { OpenRouterProvider } from "../src/providers/openrouter";

describe("Provider Factory", () => {
  it("creates OllamaProvider for 'ollama'", () => {
    const provider = createAIProvider("ollama");
    expect(provider).toBeInstanceOf(OllamaProvider);
    expect(provider.name).toBe("ollama");
  });

  it("creates OpenRouterProvider for 'openrouter'", () => {
    const provider = createAIProvider("openrouter");
    expect(provider).toBeInstanceOf(OpenRouterProvider);
    expect(provider.name).toBe("openrouter");
  });

  it("throws descriptive error for unknown provider", () => {
    expect(() => createAIProvider("invalid")).toThrow('Unknown AI provider "invalid"');
    expect(() => createAIProvider("invalid")).toThrow("Supported providers: ollama, openrouter");
    expect(() => createAIProvider("invalid")).toThrow("AI_PROVIDER");
  });

  it("throws for empty string provider", () => {
    expect(() => createAIProvider("")).toThrow('Unknown AI provider ""');
  });

  it("defaults to AI_CONFIG.provider when no argument given", () => {
    // AI_CONFIG.provider is mocked as "ollama"
    const provider = createAIProvider();
    expect(provider).toBeInstanceOf(OllamaProvider);
  });
});

describe("Provider Singleton (getAIProvider)", () => {
  beforeEach(() => {
    resetAIProvider();
  });

  it("returns a provider instance", () => {
    const provider = getAIProvider();
    expect(provider).toBeDefined();
    expect(provider.name).toBeDefined();
  });

  it("returns the same instance on subsequent calls", () => {
    const provider1 = getAIProvider();
    const provider2 = getAIProvider();
    expect(provider1).toBe(provider2);
  });

  it("returns a new instance after reset", () => {
    const provider1 = getAIProvider();
    resetAIProvider();
    const provider2 = getAIProvider();
    expect(provider1).not.toBe(provider2);
  });
});
