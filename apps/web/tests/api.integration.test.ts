import { describe, it, expect, vi } from "vitest";
import { GET as healthGET } from "../src/app/api/health/route";
import { GET as versionGET } from "../src/app/api/version/route";
import { GET as configGET } from "../src/app/api/config/route";
import { GET as searchIssuesGET } from "../src/app/api/search/issues/route";
import { GET as searchTechGET } from "../src/app/api/search/technologies/route";
import { GET as searchArchGET } from "../src/app/api/search/architectures/route";

vi.mock("@openforge/github-client", () => ({
  getIssues: vi.fn().mockResolvedValue({ nodes: [], totalCount: 0 })
}));

describe("API Standardized Envelopes Integration Tests", () => {
  it("/api/health matches standard response schema", async () => {
    const res = await healthGET();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("healthy");
    expect(body.error).toBeNull();
  });

  it("/api/version matches standard response schema", async () => {
    const res = await versionGET();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.version).toBe("1.0.0");
    expect(body.error).toBeNull();
  });

  it("/api/config matches standard response schema", async () => {
    const res = await configGET();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.appName).toBe("OpenForge");
    expect(body.error).toBeNull();
  });

  it("/api/search/technologies matches standard response schema", async () => {
    const res = await searchTechGET();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toContain("TypeScript");
  });

  it("/api/search/architectures matches standard response schema", async () => {
    const res = await searchArchGET();
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data).toContain("Monorepo");
  });

  it("/api/search/issues validates request and returns error for empty query", async () => {
    const req = new Request("http://localhost/api/search/issues?q=");
    const res = await searchIssuesGET(req);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Validation failed");
  });
});
