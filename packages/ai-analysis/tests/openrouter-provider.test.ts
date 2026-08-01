import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock the config module
vi.mock("@openforge/config", () => ({
  AI_CONFIG: {
    provider: "openrouter",
    model: "deepseek/deepseek-chat-v3",
    temperature: 0.3,
    timeoutMs: 5_000,
    retryCount: 0, // No retries for faster tests
    cacheTtlMs: 30 * 60 * 1000,
    ollamaBaseUrl: "http://localhost:11434",
    openrouter: {
      apiKey: "test-api-key-12345",
      baseUrl: "https://openrouter.ai/api/v1",
      model: "deepseek/deepseek-chat-v3",
      httpReferer: "http://localhost:3000",
      appName: "OpenForge",
    },
  },
}));

import { OpenRouterProvider } from "../src/providers/openrouter";
import {
  AIAuthenticationError,
  AIRateLimitError,
  AIModelNotFoundError,
  AIProviderError,
  AIResponseParseError,
} from "../src/errors";

const mockFetch = vi.fn();

describe("OpenRouterProvider", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("constructor", () => {
    it("uses config defaults", () => {
      const provider = new OpenRouterProvider();
      expect(provider.name).toBe("openrouter");
    });

    it("accepts config overrides", () => {
      const provider = new OpenRouterProvider({
        apiKey: "custom-key",
        model: "custom-model",
      });
      expect(provider.name).toBe("openrouter");
    });
  });

  describe("isAvailable()", () => {
    it("returns available: true with valid key", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ id: "deepseek/deepseek-chat-v3" }] }),
      });

      const provider = new OpenRouterProvider();
      const result = await provider.isAvailable();

      expect(result.available).toBe(true);
      expect(result.provider).toBe("openrouter");
      expect(result.model).toBe("deepseek/deepseek-chat-v3");
    });

    it("returns available: false with no API key", async () => {
      const provider = new OpenRouterProvider({ apiKey: "" });
      const result = await provider.isAvailable();

      expect(result.available).toBe(false);
      expect(result.message).toContain("OPENROUTER_API_KEY");
    });

    it("returns available: false on 401", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const provider = new OpenRouterProvider();
      const result = await provider.isAvailable();

      expect(result.available).toBe(false);
      expect(result.message).toContain("invalid");
    });

    it("returns available: false on 403", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      const provider = new OpenRouterProvider();
      const result = await provider.isAvailable();

      expect(result.available).toBe(false);
      expect(result.message).toContain("invalid");
    });

    it("returns available: false on network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("network error"));

      const provider = new OpenRouterProvider();
      const result = await provider.isAvailable();

      expect(result.available).toBe(false);
      expect(result.message).toContain("Failed to connect");
    });

    it("sends correct headers", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      const provider = new OpenRouterProvider();
      await provider.isAvailable();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://openrouter.ai/api/v1/models",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Authorization": "Bearer test-api-key-12345",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "OpenForge",
          }),
        }),
      );
    });
  });

  describe("chat()", () => {
    it("returns AIRawResponse on success", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: '{"result": "success"}' } }],
          model: "deepseek/deepseek-chat-v3",
        }),
      });

      const provider = new OpenRouterProvider();
      const response = await provider.chat([
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello" },
      ]);

      expect(response.content).toBe('{"result": "success"}');
      expect(response.model).toBe("deepseek/deepseek-chat-v3");
      expect(response.durationMs).toBeGreaterThanOrEqual(0);
    });

    it("sends correct request body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          choices: [{ message: { content: "response" } }],
          model: "deepseek/deepseek-chat-v3",
        }),
      });

      const provider = new OpenRouterProvider();
      await provider.chat([
        { role: "user", content: "test" },
      ], { temperature: 0.5 });

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0]).toBe("https://openrouter.ai/api/v1/chat/completions");

      const body = JSON.parse(callArgs[1].body);
      expect(body.model).toBe("deepseek/deepseek-chat-v3");
      expect(body.messages).toEqual([{ role: "user", content: "test" }]);
      expect(body.temperature).toBe(0.5);
    });

    it("throws AIAuthenticationError on 401", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIAuthenticationError);
    });

    it("throws AIAuthenticationError on 403", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIAuthenticationError);
    });

    it("throws AIModelNotFoundError on 404", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIModelNotFoundError);
    });

    it("throws AIRateLimitError on 429", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIRateLimitError);
    });

    it("throws AIProviderError on 500", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIProviderError);
    });

    it("throws AIResponseParseError on invalid JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => { throw new SyntaxError("bad json"); },
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIResponseParseError);
    });

    it("throws AIResponseParseError when response has no content", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: {} }] }),
      });

      const provider = new OpenRouterProvider();
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIResponseParseError);
    });

    it("throws AIAuthenticationError when no API key is set", async () => {
      const provider = new OpenRouterProvider({ apiKey: "" });
      await expect(provider.chat([{ role: "user", content: "test" }]))
        .rejects.toThrow(AIAuthenticationError);
    });

    it("never exposes API key in error messages", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const provider = new OpenRouterProvider();
      try {
        await provider.chat([{ role: "user", content: "test" }]);
      } catch (error: any) {
        expect(error.message).not.toContain("test-api-key-12345");
        expect(JSON.stringify(error)).not.toContain("test-api-key-12345");
      }
    });
  });
});
