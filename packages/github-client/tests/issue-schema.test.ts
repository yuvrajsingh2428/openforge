import { describe, it, expect } from "vitest";
import { IssueSchema } from "../src/types/issue";

describe("Issue Schema Validation", () => {
  it("validates a minimal issue", () => {
    const minimal = {
      id: "123",
      number: 1,
      title: "Test issue",
      state: "OPEN",
      url: "https://github.com/test/repo/issues/1",
      createdAt: "2024-01-01T00:00:00Z",
    };

    const result = IssueSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("validates a full issue with all fields", () => {
    const full = {
      id: "456",
      number: 42,
      title: "Full issue",
      body: "## Description\nSome markdown",
      state: "OPEN",
      url: "https://github.com/test/repo/issues/42",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-06-01T00:00:00Z",
      closedAt: null,
      author: { login: "testuser", avatarUrl: "https://avatars.com/u/1" },
      labels: { nodes: [{ name: "bug", color: "d73a4a" }] },
      comments: { totalCount: 5 },
      reactions: { totalCount: 3 },
      assignees: { nodes: [{ login: "dev1", avatarUrl: "https://avatars.com/u/2" }] },
      milestone: { title: "v1.0" },
      repository: {
        name: "repo",
        nameWithOwner: "test/repo",
        owner: { login: "test", avatarUrl: "https://avatars.com/u/3" },
        primaryLanguage: { name: "TypeScript", color: "#3178c6" },
      },
    };

    const result = IssueSchema.safeParse(full);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.body).toBe("## Description\nSome markdown");
      expect(result.data.author?.login).toBe("testuser");
      expect(result.data.repository?.nameWithOwner).toBe("test/repo");
      expect(result.data.comments?.totalCount).toBe(5);
    }
  });

  it("rejects issue missing required fields", () => {
    const invalid = { id: "123" };
    const result = IssueSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
