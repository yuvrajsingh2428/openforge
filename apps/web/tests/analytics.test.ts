import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  analyticsClient,
  sanitizeAnalyticsPayload,
  validateEventPayload,
  AnalyticsEvents,
  AnalyticsQueue,
} from "../src/lib/analytics";

describe("Analytics Layer Unit Tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Singleton & Anonymous ID", () => {
    it("returns singleton instance of AnalyticsClient", () => {
      const instance1 = analyticsClient;
      const instance2 = analyticsClient;
      expect(instance1).toBe(instance2);
    });

    it("generates a valid anonymous ID", () => {
      const anonId = analyticsClient.getAnonymousId();
      expect(anonId).toBeDefined();
      expect(typeof anonId).toBe("string");
    });
  });

  describe("Payload Sanitizer", () => {
    it("scrubs GitHub PATs and OpenRouter API keys from properties", () => {
      const rawEvent = {
        name: "test_event",
        properties: {
          token: "github_pat_EXAMPLE_TOKEN_00000000000000000000000000",
          openrouterKey: "sk-or-v1-EXAMPLE_KEY_00000000000000000000000000",
          normalField: "public_value",
        },
        timestamp: new Date().toISOString(),
        anonymousId: "anon-123",
        version: "1.0.0",
      };

      const sanitized = sanitizeAnalyticsPayload(rawEvent);

      expect(sanitized.properties.token).toBe("[REDACTED]");
      expect(sanitized.properties.openrouterKey).toBe("[REDACTED]");
      expect(sanitized.properties.normalField).toBe("public_value");
    });

    it("scrubs Bearer tokens and email addresses in string values", () => {
      const rawEvent = {
        name: "test_string_scrub",
        properties: {
          authHeader: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.K4-...",
          userEmail: "developer@example.com",
        },
        timestamp: new Date().toISOString(),
        anonymousId: "anon-123",
        version: "1.0.0",
      };

      const sanitized = sanitizeAnalyticsPayload(rawEvent);

      expect(sanitized.properties.authHeader).not.toContain("eyJhbGciOiJIUzI1Ni");
      expect(sanitized.properties.userEmail).not.toContain("developer@example.com");
    });
  });

  describe("Event Schema Validation", () => {
    it("validates correct repository view event payload", () => {
      const result = validateEventPayload(AnalyticsEvents.REPOSITORY_VIEWED, {
        owner: "facebook",
        repo: "react",
        stars: 220000,
      });

      expect(result.valid).toBe(true);
    });

    it("rejects invalid repository view event payload missing owner", () => {
      const result = validateEventPayload(AnalyticsEvents.REPOSITORY_VIEWED, {
        repo: "react",
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain("owner");
    });
  });

  describe("Queue System", () => {
    it("enqueues and holds items correctly", () => {
      const queue = new AnalyticsQueue();
      queue.enqueue({
        name: AnalyticsEvents.APP_STARTED,
        properties: {},
        timestamp: new Date().toISOString(),
        anonymousId: "anon-123",
        version: "1.0.0",
      });

      expect(queue.getQueueLength()).toBeGreaterThanOrEqual(1);
    });
  });
});
