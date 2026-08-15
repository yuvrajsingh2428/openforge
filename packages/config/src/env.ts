import { z } from "zod";

// Populate process.env from .env if running in Node environment without dotenv pre-loaded
if (typeof window === "undefined" && typeof process !== "undefined" && process.env && !process.env.GITHUB_TOKEN) {
  try {
    const fs = require("fs");
    const path = require("path");
    const dotenv = require("dotenv");
    const cwd = process.cwd();
    const candidatePaths = [
      path.resolve(cwd, ".env"),
      path.resolve(cwd, "..", ".env"),
      path.resolve(cwd, "..", "..", ".env"),
      path.resolve(__dirname, ".env"),
      path.resolve(__dirname, "..", ".env"),
      path.resolve(__dirname, "..", "..", ".env"),
      path.resolve(__dirname, "..", "..", "..", ".env"),
    ];
    for (const envPath of candidatePaths) {
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        if (process.env.GITHUB_TOKEN) break;
      }
    }
  } catch {
    // Ignore in environments where require is unavailable
  }
}

/**
 * Coerce a string environment variable to a boolean.
 * Accepts "true", "1", "yes" as truthy; everything else is falsy.
 */
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    return ["true", "1", "yes"].includes(val.trim().toLowerCase());
  });

/**
 * Zod schema for all environment variables used by OpenForge.
 *
 * - process.env is parsed exactly ONCE when this module is first imported.
 * - Every other package must import `env` from `@openforge/config`.
 * - GITHUB_TOKEN is optional so the app can start without it for UI-only dev.
 */
const envSchema = z.object({
  // ── Application ──────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // ── GitHub ───────────────────────────────────────────────────
  GITHUB_TOKEN: z.string().optional().default(""),
  GITHUB_API_URL: z.string().url().default("https://api.github.com/graphql"),
  GITHUB_REST_API_URL: z.string().url().default("https://api.github.com"),
  GITHUB_USER_AGENT: z.string().default("OpenForge"),

  // ── AI Provider ──────────────────────────────────────────────
  AI_PROVIDER: z
    .enum(["ollama", "openrouter"])
    .default("ollama"),

  // ── AI / Ollama ──────────────────────────────────────────────
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_CHAT_MODEL: z.string().default("qwen3:8b"),
  OLLAMA_SUMMARY_MODEL: z.string().default("gemma3:latest"),
  OLLAMA_EMBEDDING_MODEL: z.string().default("nomic-embed-text"),
  OLLAMA_TIMEOUT: z.coerce.number().positive().default(120_000),

  // ── AI / OpenRouter ─────────────────────────────────────────
  OPENROUTER_API_KEY: z.string().optional().default(""),
  OPENROUTER_BASE_URL: z.string().url().default("https://openrouter.ai/api/v1"),
  OPENROUTER_MODEL: z.string().default("deepseek/deepseek-chat-v3"),
  OPENROUTER_HTTP_REFERER: z.string().default("http://localhost:3000"),
  OPENROUTER_APP_NAME: z.string().default("OpenForge"),

  // ── Debug Security ───────────────────────────────────────────
  DEBUG_API_SECRET: z.string().optional().default(""),

  // ── Feature Flags ────────────────────────────────────────────
  ENABLE_AI: booleanFromString.default(true),
  ENABLE_RECOMMENDATIONS: booleanFromString.default(true),
  ENABLE_MENTOR: booleanFromString.default(true),
  ENABLE_REPOSITORY_INTELLIGENCE: booleanFromString.default(true),

  // ── AI Runtime Parameters ─────────────────────────────────────
  AI_MAX_RETRIES: z.coerce.number().int().nonnegative().default(3),
  AI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0),
  AI_MAX_TOKENS: z.coerce.number().positive().default(4096),
  AI_REQUEST_TIMEOUT: z.coerce.number().positive().default(120_000),

  // ── Cache ────────────────────────────────────────────────────
  CACHE_ENABLED: booleanFromString.default(true),
  CACHE_TTL: z.coerce.number().positive().default(3600),

  // ── Repository Analysis ──────────────────────────────────────
  MAX_REPOSITORY_FILES: z.coerce.number().positive().default(10_000),
  MAX_REPOSITORY_DEPTH: z.coerce.number().positive().default(8),

  // ── Search ───────────────────────────────────────────────────
  SEARCH_PAGE_SIZE: z.coerce.number().positive().default(20),
  SEARCH_MAX_RESULTS: z.coerce.number().positive().default(100),

  // ── Logging ──────────────────────────────────────────────────
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("info"),
  DEBUG_MODE: booleanFromString.default(false),
});

/** Inferred TypeScript type for the validated environment. */
export type Env = z.infer<typeof envSchema>;

// ── Parse once at import time ────────────────────────────────────
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(
    `\n❌ Invalid environment configuration:\n\n${formatted}\n\n` +
      `Check your .env file against .env.example.\n`
  );
}

/**
 * Strongly-typed, immutable environment configuration.
 *
 * This is the ONLY place process.env is read in the entire application.
 * All other packages must import `env` from `@openforge/config`.
 */
export const env: Env = Object.freeze(parsed.data);

/**
 * Re-export the schema for testing purposes.
 * @internal
 */
export { envSchema as _envSchema };
