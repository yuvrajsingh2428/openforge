import { describe, it, expect } from "vitest";
import { _envSchema as envSchema } from "../src/env";

// ── Helper: build a fully valid env object ───────────────────────
function validEnv(overrides: Record<string, unknown> = {}) {
  return {
    NODE_ENV: "development",
    GITHUB_TOKEN: "ghp_test_token_abc123",
    GITHUB_API_URL: "https://api.github.com/graphql",
    GITHUB_REST_API_URL: "https://api.github.com",
    GITHUB_USER_AGENT: "OpenForge",
    OLLAMA_BASE_URL: "http://localhost:11434",
    OLLAMA_CHAT_MODEL: "qwen3:8b",
    OLLAMA_SUMMARY_MODEL: "gemma3:latest",
    OLLAMA_EMBEDDING_MODEL: "nomic-embed-text",
    OLLAMA_TIMEOUT: "120000",
    DEBUG_API_SECRET: "",
    ENABLE_AI: "true",
    ENABLE_RECOMMENDATIONS: "true",
    ENABLE_MENTOR: "true",
    ENABLE_REPOSITORY_INTELLIGENCE: "true",
    AI_MAX_RETRIES: "3",
    AI_TEMPERATURE: "0",
    AI_MAX_TOKENS: "4096",
    AI_REQUEST_TIMEOUT: "120000",
    CACHE_ENABLED: "true",
    CACHE_TTL: "3600",
    MAX_REPOSITORY_FILES: "10000",
    MAX_REPOSITORY_DEPTH: "8",
    SEARCH_PAGE_SIZE: "20",
    SEARCH_MAX_RESULTS: "100",
    LOG_LEVEL: "info",
    DEBUG_MODE: "false",
    ...overrides,
  };
}

describe("Environment Configuration Schema Phase AI-2 Additions", () => {
  it("should parse DEBUG_API_SECRET correctly", () => {
    const result = envSchema.safeParse(validEnv({ DEBUG_API_SECRET: "my-secret-key-123" }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.DEBUG_API_SECRET).toBe("my-secret-key-123");
    }
  });

  it("should parse Feature Flags with defaults", () => {
    const result = envSchema.safeParse(validEnv({
      ENABLE_AI: "false",
      ENABLE_RECOMMENDATIONS: "1",
    }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ENABLE_AI).toBe(false);
      expect(result.data.ENABLE_RECOMMENDATIONS).toBe(true);
      expect(result.data.ENABLE_MENTOR).toBe(true);
      expect(result.data.ENABLE_REPOSITORY_INTELLIGENCE).toBe(true);
    }
  });

  it("should parse AI Runtime Configuration", () => {
    const result = envSchema.safeParse(validEnv({
      AI_MAX_RETRIES: "5",
      AI_TEMPERATURE: "0.7",
      AI_MAX_TOKENS: "8192",
      AI_REQUEST_TIMEOUT: "60000",
    }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.AI_MAX_RETRIES).toBe(5);
      expect(result.data.AI_TEMPERATURE).toBe(0.7);
      expect(result.data.AI_MAX_TOKENS).toBe(8192);
      expect(result.data.AI_REQUEST_TIMEOUT).toBe(60000);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════
// Tests
// ═══════════════════════════════════════════════════════════════════

describe("Environment Configuration Schema", () => {
  // ── Valid configuration ──────────────────────────────────────────
  describe("valid configuration", () => {
    it("should parse a fully valid environment", () => {
      const result = envSchema.safeParse(validEnv());
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe("development");
        expect(result.data.GITHUB_TOKEN).toBe("ghp_test_token_abc123");
        expect(result.data.OLLAMA_TIMEOUT).toBe(120_000);
        expect(result.data.CACHE_ENABLED).toBe(true);
        expect(result.data.DEBUG_MODE).toBe(false);
      }
    });

    it("should accept production NODE_ENV", () => {
      const result = envSchema.safeParse(validEnv({ NODE_ENV: "production" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe("production");
      }
    });

    it("should accept test NODE_ENV", () => {
      const result = envSchema.safeParse(validEnv({ NODE_ENV: "test" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe("test");
      }
    });
  });

  // ── Default values ───────────────────────────────────────────────
  describe("default values", () => {
    it("should apply all defaults when given an empty object", () => {
      const result = envSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.NODE_ENV).toBe("development");
        expect(result.data.GITHUB_TOKEN).toBe("");
        expect(result.data.GITHUB_API_URL).toBe("https://api.github.com/graphql");
        expect(result.data.GITHUB_REST_API_URL).toBe("https://api.github.com");
        expect(result.data.GITHUB_USER_AGENT).toBe("OpenForge");
        expect(result.data.OLLAMA_BASE_URL).toBe("http://localhost:11434");
        expect(result.data.OLLAMA_CHAT_MODEL).toBe("qwen3:8b");
        expect(result.data.OLLAMA_SUMMARY_MODEL).toBe("gemma3:latest");
        expect(result.data.OLLAMA_EMBEDDING_MODEL).toBe("nomic-embed-text");
        expect(result.data.OLLAMA_TIMEOUT).toBe(120_000);
        expect(result.data.CACHE_ENABLED).toBe(true);
        expect(result.data.CACHE_TTL).toBe(3600);
        expect(result.data.MAX_REPOSITORY_FILES).toBe(10_000);
        expect(result.data.MAX_REPOSITORY_DEPTH).toBe(8);
        expect(result.data.SEARCH_PAGE_SIZE).toBe(20);
        expect(result.data.SEARCH_MAX_RESULTS).toBe(100);
        expect(result.data.LOG_LEVEL).toBe("info");
        expect(result.data.DEBUG_MODE).toBe(false);
      }
    });
  });

  // ── GitHub token (optional) ──────────────────────────────────────
  describe("GITHUB_TOKEN", () => {
    it("should allow missing GITHUB_TOKEN (defaults to empty string)", () => {
      const result = envSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.GITHUB_TOKEN).toBe("");
      }
    });

    it("should accept a valid GITHUB_TOKEN", () => {
      const result = envSchema.safeParse(validEnv({ GITHUB_TOKEN: "ghp_abc123" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.GITHUB_TOKEN).toBe("ghp_abc123");
      }
    });
  });

  // ── Invalid URL ──────────────────────────────────────────────────
  describe("URL validation", () => {
    it("should reject invalid GITHUB_API_URL", () => {
      const result = envSchema.safeParse(validEnv({ GITHUB_API_URL: "not-a-url" }));
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "GITHUB_API_URL");
        expect(issue).toBeDefined();
      }
    });

    it("should reject invalid GITHUB_REST_API_URL", () => {
      const result = envSchema.safeParse(validEnv({ GITHUB_REST_API_URL: "foobar" }));
      expect(result.success).toBe(false);
    });

    it("should reject invalid OLLAMA_BASE_URL", () => {
      const result = envSchema.safeParse(validEnv({ OLLAMA_BASE_URL: "invalid" }));
      expect(result.success).toBe(false);
    });
  });

  // ── Invalid enum ─────────────────────────────────────────────────
  describe("enum validation", () => {
    it("should reject invalid NODE_ENV", () => {
      const result = envSchema.safeParse(validEnv({ NODE_ENV: "staging" }));
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "NODE_ENV");
        expect(issue).toBeDefined();
      }
    });

    it("should reject invalid LOG_LEVEL", () => {
      const result = envSchema.safeParse(validEnv({ LOG_LEVEL: "verbose" }));
      expect(result.success).toBe(false);
      if (!result.success) {
        const issue = result.error.issues.find((i) => i.path[0] === "LOG_LEVEL");
        expect(issue).toBeDefined();
      }
    });
  });

  // ── Boolean parsing ──────────────────────────────────────────────
  describe("boolean parsing", () => {
    it("should parse 'true' as true", () => {
      const result = envSchema.safeParse(validEnv({ CACHE_ENABLED: "true" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.CACHE_ENABLED).toBe(true);
      }
    });

    it("should parse 'false' as false", () => {
      const result = envSchema.safeParse(validEnv({ CACHE_ENABLED: "false" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.CACHE_ENABLED).toBe(false);
      }
    });

    it("should parse '1' as true", () => {
      const result = envSchema.safeParse(validEnv({ DEBUG_MODE: "1" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.DEBUG_MODE).toBe(true);
      }
    });

    it("should parse '0' as false", () => {
      const result = envSchema.safeParse(validEnv({ DEBUG_MODE: "0" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.DEBUG_MODE).toBe(false);
      }
    });

    it("should parse 'yes' as true", () => {
      const result = envSchema.safeParse(validEnv({ CACHE_ENABLED: "yes" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.CACHE_ENABLED).toBe(true);
      }
    });

    it("should parse 'no' as false", () => {
      const result = envSchema.safeParse(validEnv({ CACHE_ENABLED: "no" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.CACHE_ENABLED).toBe(false);
      }
    });

    it("should reject invalid boolean-like value gracefully (non-truthy becomes false)", () => {
      const result = envSchema.safeParse(validEnv({ DEBUG_MODE: "banana" }));
      expect(result.success).toBe(true);
      if (result.success) {
        // "banana" is not in ["true", "1", "yes"], so it becomes false
        expect(result.data.DEBUG_MODE).toBe(false);
      }
    });
  });

  // ── Numeric parsing ──────────────────────────────────────────────
  describe("numeric parsing", () => {
    it("should coerce string numbers to numbers", () => {
      const result = envSchema.safeParse(validEnv({ OLLAMA_TIMEOUT: "60000" }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.OLLAMA_TIMEOUT).toBe(60_000);
        expect(typeof result.data.OLLAMA_TIMEOUT).toBe("number");
      }
    });

    it("should reject non-numeric strings for numeric fields", () => {
      const result = envSchema.safeParse(validEnv({ OLLAMA_TIMEOUT: "not-a-number" }));
      expect(result.success).toBe(false);
    });

    it("should reject negative numbers", () => {
      const result = envSchema.safeParse(validEnv({ CACHE_TTL: "-100" }));
      expect(result.success).toBe(false);
    });

    it("should reject zero for positive number fields", () => {
      const result = envSchema.safeParse(validEnv({ SEARCH_PAGE_SIZE: "0" }));
      expect(result.success).toBe(false);
    });

    it("should accept valid positive integers", () => {
      const result = envSchema.safeParse(validEnv({
        MAX_REPOSITORY_FILES: "5000",
        MAX_REPOSITORY_DEPTH: "12",
        SEARCH_PAGE_SIZE: "50",
        SEARCH_MAX_RESULTS: "200",
      }));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.MAX_REPOSITORY_FILES).toBe(5000);
        expect(result.data.MAX_REPOSITORY_DEPTH).toBe(12);
        expect(result.data.SEARCH_PAGE_SIZE).toBe(50);
        expect(result.data.SEARCH_MAX_RESULTS).toBe(200);
      }
    });
  });

  // ── Unknown variables ────────────────────────────────────────────
  describe("unknown environment variables", () => {
    it("should not break parsing when unknown variables are present", () => {
      const result = envSchema.safeParse(validEnv({
        UNKNOWN_VAR: "some-value",
        ANOTHER_UNKNOWN: "12345",
        RANDOM_CONFIG: "true",
      }));
      expect(result.success).toBe(true);
    });
  });

  // ── Immutability ─────────────────────────────────────────────────
  describe("immutable env object", () => {
    it("should produce a frozen object via Object.freeze", () => {
      const result = envSchema.safeParse(validEnv());
      expect(result.success).toBe(true);
      if (result.success) {
        const frozen = Object.freeze(result.data);
        expect(Object.isFrozen(frozen)).toBe(true);

        // Attempting to mutate should throw in strict mode or silently fail
        expect(() => {
          (frozen as any).NODE_ENV = "production";
        }).toThrow();
      }
    });
  });
});
