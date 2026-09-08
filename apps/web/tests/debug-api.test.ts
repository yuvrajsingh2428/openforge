import { describe, it, expect, vi } from "vitest";
import { GET as debugCacheGET, POST as debugCachePOST } from "../src/app/api/debug/cache/route";
import { GET as debugRepositoriesGET } from "../src/app/api/debug/repositories/route";

const { mockEnv } = vi.hoisted(() => ({
  mockEnv: {
    NODE_ENV: "development",
    DEBUG_API_SECRET: "",
  },
}));

vi.mock("@openforge/config", async (importOriginal) => {
  const original = await importOriginal<typeof import("@openforge/config")>();
  return {
    ...original,
    env: mockEnv,
  };
});

vi.mock("@openforge/github-client", () => ({
  getRepositories: vi.fn().mockResolvedValue([]),
}));

describe("Debug API Security (DEBUG_API_SECRET)", () => {
  it("allows access when DEBUG_API_SECRET is empty", async () => {
    (mockEnv as any).DEBUG_API_SECRET = "";
    (mockEnv as any).NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache");
    const res = await debugCacheGET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("rejects request with 401 when DEBUG_API_SECRET is set but header is missing", async () => {
    (mockEnv as any).DEBUG_API_SECRET = "super-secret-key-123";
    (mockEnv as any).NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache");
    const res = await debugCacheGET(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  it("rejects request with 401 when DEBUG_API_SECRET is set but header is invalid", async () => {
    (mockEnv as any).DEBUG_API_SECRET = "super-secret-key-123";
    (mockEnv as any).NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "wrong-secret" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(401);
  });

  it("allows access when DEBUG_API_SECRET is set and header matches", async () => {
    (mockEnv as any).DEBUG_API_SECRET = "super-secret-key-123";
    (mockEnv as any).NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "super-secret-key-123" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("blocks access in production mode regardless of secret header", async () => {
    (mockEnv as any).DEBUG_API_SECRET = "super-secret-key-123";
    (mockEnv as any).NODE_ENV = "production";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "super-secret-key-123" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(403);

    // Reset env NODE_ENV back to development/test
    (mockEnv as any).NODE_ENV = "test";
    (mockEnv as any).DEBUG_API_SECRET = "";
  });
});
