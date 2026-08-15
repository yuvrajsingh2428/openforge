import { describe, it, expect } from "vitest";
import { AI_CONFIG } from "../src/ai";
import { env } from "../src/env";

describe("AI_CONFIG Centralized Configuration", () => {
  it("should calculate cacheTtlMs from CACHE_TTL in seconds", () => {
    expect(AI_CONFIG.cacheTtlMs).toBe(env.CACHE_TTL * 1000);
  });

  it("should set timeoutMs from AI_REQUEST_TIMEOUT or OLLAMA_TIMEOUT", () => {
    expect(AI_CONFIG.timeoutMs).toBe(env.AI_REQUEST_TIMEOUT ?? env.OLLAMA_TIMEOUT);
  });

  it("should expose retryCount from AI_MAX_RETRIES", () => {
    expect(AI_CONFIG.retryCount).toBe(env.AI_MAX_RETRIES);
  });

  it("should expose temperature from AI_TEMPERATURE", () => {
    expect(AI_CONFIG.temperature).toBe(env.AI_TEMPERATURE);
  });

  it("should expose maxTokens from AI_MAX_TOKENS", () => {
    expect(AI_CONFIG.maxTokens).toBe(env.AI_MAX_TOKENS);
  });
});
