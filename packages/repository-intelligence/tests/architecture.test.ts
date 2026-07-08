import { describe, it, expect } from "vitest";
import { ArchitectureDetector } from "../src/architecture/detector";

describe("Architecture Detector", () => {
  it("should detect Monorepo correctly", () => {
    const files = [
      { path: "turbo.json", type: "blob" as const, sha: "1" },
      { path: "packages", type: "tree" as const, sha: "2" },
      { path: "apps", type: "tree" as const, sha: "3" }
    ];

    const patterns = ArchitectureDetector.detect(files);
    const monorepo = patterns.find(p => p.name === "Monorepo");
    
    expect(monorepo).toBeDefined();
    expect(monorepo!.confidence).toBeCloseTo(0.9);
  });

  it("should detect MVC correctly", () => {
    const files = [
      { path: "models/user.ts", type: "blob" as const, sha: "1" },
      { path: "views/user.html", type: "blob" as const, sha: "2" },
      { path: "controllers/user.ts", type: "blob" as const, sha: "3" }
    ];

    const patterns = ArchitectureDetector.detect(files);
    const mvc = patterns.find(p => p.name === "MVC");
    
    expect(mvc).toBeDefined();
    expect(mvc!.confidence).toBeGreaterThan(0.9);
  });
});
