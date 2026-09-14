import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as debugCacheGET } from "../src/app/api/debug/cache/route";

const mockEnv = {
  DEBUG_API_SECRET: "",
  NODE_ENV: "development",
};

vi.mock("@openforge/config", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@openforge/config")>();
  return {
    ...actual,
    get env() {
      return mockEnv as any;
    },
  };
});

vi.mock("@openforge/github-client", () => ({
  getRepositories: vi.fn().mockResolvedValue([]),
}));

describe("Debug API Security (DEBUG_API_SECRET)", () => {
  beforeEach(() => {
    mockEnv.DEBUG_API_SECRET = "";
    mockEnv.NODE_ENV = "development";
  });

  it("allows access when DEBUG_API_SECRET is empty", async () => {
    mockEnv.DEBUG_API_SECRET = "";
    mockEnv.NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache");
    const res = await debugCacheGET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("rejects request with 401 when DEBUG_API_SECRET is set but header is missing", async () => {
    mockEnv.DEBUG_API_SECRET = "super-secret-key-123";
    mockEnv.NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache");
    const res = await debugCacheGET(req);
    expect(res.status).toBe(401);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe("Unauthorized");
  });

  it("rejects request with 401 when DEBUG_API_SECRET is set but header is invalid", async () => {
    mockEnv.DEBUG_API_SECRET = "super-secret-key-123";
    mockEnv.NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "wrong-secret" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(401);
  });

  it("allows access when DEBUG_API_SECRET is set and header matches", async () => {
    mockEnv.DEBUG_API_SECRET = "super-secret-key-123";
    mockEnv.NODE_ENV = "development";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "super-secret-key-123" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("blocks access in production mode regardless of secret header", async () => {
    mockEnv.DEBUG_API_SECRET = "super-secret-key-123";
    mockEnv.NODE_ENV = "production";

    const req = new Request("http://localhost/api/debug/cache", {
      headers: { "x-debug-secret": "super-secret-key-123" },
    });
    const res = await debugCacheGET(req);
    expect(res.status).toBe(403);
  });
});
