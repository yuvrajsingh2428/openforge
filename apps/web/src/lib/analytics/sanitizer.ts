import type { AnalyticsEvent } from "./types";

const SECRET_PATTERNS = [
  /ghp_[a-zA-Z0-9]{36,255}/g,
  /github_pat_[a-zA-Z0-9_]{30,255}/g,
  /sk-or-v1-[a-zA-Z0-9]{32,255}/g,
  /sk-[a-zA-Z0-9]{32,255}/g,
  /Bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*/gi,
  /ey[Jj][a-zA-Z0-9\-_=\.]+\.[a-zA-Z0-9\-_=\.]+\.?[a-zA-Z0-9\-_=\.]*/g, // JWT
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Email
];

const SECRET_KEYS = [
  "token",
  "github_token",
  "githubtoken",
  "openrouter_api_key",
  "openrouterkey",
  "api_key",
  "apikey",
  "secret",
  "password",
  "auth",
  "authorization",
  "prompt",
  "prompts",
  "private_body",
];

function sanitizeString(val: string): string {
  let cleaned = val;
  for (const pattern of SECRET_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED_SECRET]");
  }
  return cleaned;
}

function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeString(obj);
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SECRET_KEYS.some((sk) => lowerKey.includes(sk))) {
      result[key] = "[REDACTED]";
    } else {
      result[key] = sanitizeObject(value);
    }
  }
  return result;
}

export function sanitizeAnalyticsPayload(event: AnalyticsEvent): AnalyticsEvent {
  return {
    ...event,
    name: sanitizeString(event.name),
    properties: sanitizeObject(event.properties),
  };
}
