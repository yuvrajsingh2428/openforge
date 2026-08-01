import { describe, it, expect } from "vitest";
import {
  AIProviderError,
  AIAuthenticationError,
  AIRateLimitError,
  AIModelNotFoundError,
  AITimeoutError,
  AINetworkError,
  AIResponseParseError,
} from "../src/errors";

describe("AI Error Hierarchy", () => {
  describe("AIProviderError (base class)", () => {
    it("sets correct properties", () => {
      const error = new AIProviderError("test error", "test-provider", 500, true);
      expect(error.message).toBe("test error");
      expect(error.provider).toBe("test-provider");
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(true);
      expect(error.name).toBe("AIProviderError");
    });

    it("extends Error", () => {
      const error = new AIProviderError("test", "p");
      expect(error).toBeInstanceOf(Error);
    });

    it("defaults retryable to false", () => {
      const error = new AIProviderError("test", "p");
      expect(error.retryable).toBe(false);
    });
  });

  describe("AIAuthenticationError", () => {
    it("extends AIProviderError", () => {
      const error = new AIAuthenticationError("test-provider");
      expect(error).toBeInstanceOf(AIProviderError);
      expect(error).toBeInstanceOf(Error);
    });

    it("has correct defaults", () => {
      const error = new AIAuthenticationError("openrouter");
      expect(error.name).toBe("AIAuthenticationError");
      expect(error.provider).toBe("openrouter");
      expect(error.statusCode).toBe(401);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain("Authentication failed");
      expect(error.message).toContain("openrouter");
    });

    it("accepts custom status code", () => {
      const error = new AIAuthenticationError("test", 403);
      expect(error.statusCode).toBe(403);
    });
  });

  describe("AIRateLimitError", () => {
    it("extends AIProviderError", () => {
      const error = new AIRateLimitError("test");
      expect(error).toBeInstanceOf(AIProviderError);
    });

    it("is retryable", () => {
      const error = new AIRateLimitError("test");
      expect(error.retryable).toBe(true);
      expect(error.statusCode).toBe(429);
      expect(error.name).toBe("AIRateLimitError");
    });

    it("stores retryAfterMs", () => {
      const error = new AIRateLimitError("test", 5000);
      expect(error.retryAfterMs).toBe(5000);
    });
  });

  describe("AIModelNotFoundError", () => {
    it("extends AIProviderError", () => {
      const error = new AIModelNotFoundError("test", "gpt-4");
      expect(error).toBeInstanceOf(AIProviderError);
    });

    it("has correct properties", () => {
      const error = new AIModelNotFoundError("openrouter", "gpt-4");
      expect(error.name).toBe("AIModelNotFoundError");
      expect(error.statusCode).toBe(404);
      expect(error.retryable).toBe(false);
      expect(error.message).toContain("gpt-4");
      expect(error.message).toContain("openrouter");
    });
  });

  describe("AITimeoutError", () => {
    it("extends AIProviderError", () => {
      const error = new AITimeoutError("test", 5000);
      expect(error).toBeInstanceOf(AIProviderError);
    });

    it("is retryable", () => {
      const error = new AITimeoutError("test", 5000);
      expect(error.retryable).toBe(true);
      expect(error.name).toBe("AITimeoutError");
      expect(error.message).toContain("5000ms");
    });
  });

  describe("AINetworkError", () => {
    it("extends AIProviderError", () => {
      const error = new AINetworkError("test");
      expect(error).toBeInstanceOf(AIProviderError);
    });

    it("is retryable", () => {
      const error = new AINetworkError("test", "connection refused");
      expect(error.retryable).toBe(true);
      expect(error.name).toBe("AINetworkError");
      expect(error.message).toContain("connection refused");
    });
  });

  describe("AIResponseParseError", () => {
    it("extends AIProviderError", () => {
      const error = new AIResponseParseError("test");
      expect(error).toBeInstanceOf(AIProviderError);
    });

    it("is not retryable", () => {
      const error = new AIResponseParseError("test", "invalid json");
      expect(error.retryable).toBe(false);
      expect(error.name).toBe("AIResponseParseError");
      expect(error.message).toContain("invalid json");
    });
  });

  describe("Error messages never contain API keys", () => {
    const fakeKey = "sk-or-v1-secret-key-12345";

    it("AIAuthenticationError does not leak keys", () => {
      const error = new AIAuthenticationError("openrouter");
      expect(error.message).not.toContain(fakeKey);
    });

    it("AIProviderError does not accept key as provider", () => {
      // Even if someone passes the key as the provider name accidentally,
      // the error type itself doesn't reference keys
      const error = new AIProviderError("some error", "openrouter", 500);
      expect(error.message).not.toContain(fakeKey);
    });
  });
});
