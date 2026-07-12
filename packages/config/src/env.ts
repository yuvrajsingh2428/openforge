import { z } from "zod";

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

  // ── AI / Ollama ──────────────────────────────────────────────
  OLLAMA_BASE_URL: z.string().url().default("http://localhost:11434"),
  OLLAMA_CHAT_MODEL: z.string().default("qwen3:8b"),
  OLLAMA_SUMMARY_MODEL: z.string().default("gemma3:latest"),
  OLLAMA_EMBEDDING_MODEL: z.string().default("nomic-embed-text"),
  OLLAMA_TIMEOUT: z.coerce.number().positive().default(120_000),

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
