import { describe, it, expect } from "vitest";
import { extractPageInfo } from "../src/utils/pagination";
import { extractRateLimit } from "../src/utils/rate-limit";

describe("Pagination Utility", () => {
  it("extracts page info correctly", () => {
    const mockData = {
      pageInfo: {
        hasNextPage: true,
        endCursor: "cursor123"
      }
    };
    
    const pageInfo = extractPageInfo(mockData);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.endCursor).toBe("cursor123");
  });

  it("handles missing page info", () => {
    const pageInfo = extractPageInfo(null);
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.endCursor).toBe(null);
  });
});

describe("Rate Limit Utility", () => {
  it("extracts rate limit info correctly", () => {
    const mockData = {
      rateLimit: {
        limit: 5000,
        remaining: 4999,
        resetAt: "2023-01-01T00:00:00Z"
      }
    };
    
    const rateLimit = extractRateLimit(mockData);
    expect(rateLimit?.limit).toBe(5000);
    expect(rateLimit?.remaining).toBe(4999);
    expect(rateLimit?.resetAt).toBeInstanceOf(Date);
  });

  it("handles missing rate limit", () => {
    const rateLimit = extractRateLimit({});
    expect(rateLimit).toBeNull();
  });
});
