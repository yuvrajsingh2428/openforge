import { describe, it, expect } from "vitest";
import { z } from "zod";

/**
 * We test the env schema directly rather than importing env.ts
 * (which would parse process.env at import time and potentially fail).
 * Instead, we replicate the schema here to test parsing behavior in isolation.
 */

// ── Replicate the boolean coercion helper ────────────────────────
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    return ["true", "1", "yes"].includes(val.trim().toLowerCase());
  });

// ── Replicate the env schema ─────────────────────────────────────
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GITHUB_TOKEN: z.string().optional().default(""),
  GITHUB_API_URL: z.string().url().default("https://api.github.com/graphql"),
  GITHUB_REST_API_URL: z.string().url().default("https://api.github.com"),
  GITHUB_USER_AGENT: z.string().default("OpenForge"),
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_CHAT_MODEL: z.string().default("qwen3:8b"),
  OLLAMA_SUMMARY_MODEL: z.string().default("gemma3:latest"),
  OLLAMA_EMBEDDING_MODEL: z.string().default("nomic-embed-text"),
  OLLAMA_TIMEOUT: z.coerce.number().positive().default(120_000),
  CACHE_ENABLED: booleanFromString.default(true),
  CACHE_TTL: z.coerce.number().positive().default(3600),
  MAX_REPOSITORY_FILES: z.coerce.number().positive().default(10_000),
  MAX_REPOSITORY_DEPTH: z.coerce.number().positive().default(8),
  SEARCH_PAGE_SIZE: z.coerce.number().positive().default(20),
  SEARCH_MAX_RESULTS: z.coerce.number().positive().default(100),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  DEBUG_MODE: booleanFromString.default(false),
});

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
