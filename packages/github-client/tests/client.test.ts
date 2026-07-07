import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGraphQL } from "../src/client";
import { AuthenticationError, RateLimitError } from "../src/errors";
import * as configModule from "../src/config";

vi.mock("../src/config", () => ({
  getConfig: vi.fn(),
}));

describe("GraphQL Client", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (configModule.getConfig as any).mockReturnValue({ GITHUB_TOKEN: "test-token" });
    global.fetch = vi.fn();
  });

  it("throws AuthenticationError on 401", async () => {
    (global.fetch as any).mockResolvedValue({
      status: 401,
      headers: new Headers(),
    });

    await expect(
      fetchGraphQL({ query: "query {}" })
    ).rejects.toThrow(AuthenticationError);
  });

  it("throws RateLimitError on 403 with rate limit headers", async () => {
    (global.fetch as any).mockResolvedValue({
      status: 403,
      headers: new Headers({
        "x-ratelimit-remaining": "0",
        "x-ratelimit-reset": (Date.now() / 1000).toString(),
      }),
    });

    await expect(
      fetchGraphQL({ query: "query {}" })
    ).rejects.toThrow(RateLimitError);
  });

  it("returns data on success", async () => {
    const mockData = { repository: { name: "test" } };
    (global.fetch as any).mockResolvedValue({
      status: 200,
      ok: true,
      headers: new Headers(),
      json: async () => ({ data: mockData }),
    });

    const data = await fetchGraphQL({ query: "query {}" });
    expect(data).toEqual(mockData);
  });
});
