import { env } from "./env";

export interface AIConfig {
  readonly provider: "ollama" | "openrouter";
  readonly model: string;
  readonly temperature: number;
  readonly timeoutMs: number;
  readonly retryCount: number;
  readonly cacheTtlMs: number;
  readonly ollamaBaseUrl: string;
  readonly openrouter: {
    readonly apiKey: string;
    readonly baseUrl: string;
    readonly model: string;
    readonly httpReferer: string;
    readonly appName: string;
  };
}

export const AI_CONFIG: AIConfig = {
  provider: env.AI_PROVIDER as "ollama" | "openrouter",
  model: env.AI_PROVIDER === "openrouter" ? env.OPENROUTER_MODEL : env.OLLAMA_CHAT_MODEL,
  temperature: 0.3,
  timeoutMs: 60_000,
  retryCount: 2,
  cacheTtlMs: 30 * 60 * 1000, // 30 minutes
  ollamaBaseUrl: env.OLLAMA_BASE_URL,
  openrouter: {
    apiKey: env.OPENROUTER_API_KEY ?? "",
    baseUrl: env.OPENROUTER_BASE_URL,
    model: env.OPENROUTER_MODEL,
    httpReferer: env.OPENROUTER_HTTP_REFERER,
    appName: env.OPENROUTER_APP_NAME,
  },
};

export const PROMPT_VERSIONS = {
  issueSummary: "v1",
  contributionPlan: "v1",
  repositorySummary: "v1",
  learningPath: "v1",
  conceptExtraction: "v1",
  complexityAnalysis: "v1",
} as const;
