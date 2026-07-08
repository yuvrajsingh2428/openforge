import { describe, it, expect } from "vitest";
import { DependencyDetector } from "../src/dependencies/detector";

describe("Dependency Detector", () => {
  it("should parse package.json correctly", () => {
    const file = {
      path: "package.json",
      type: "blob" as const,
      sha: "1",
      content: JSON.stringify({
        dependencies: {
          react: "18.0.0",
          prisma: "5.0.0"
        },
        devDependencies: {
          vitest: "1.0.0",
          webpack: "5.0.0"
        }
      })
    };

    const deps = DependencyDetector.detect(file);
    
    expect(deps).toContainEqual({ name: "react", version: "18.0.0", category: "Direct" });
    expect(deps).toContainEqual({ name: "prisma", version: "5.0.0", category: "Database" });
    expect(deps).toContainEqual({ name: "vitest", version: "1.0.0", category: "Testing" });
    expect(deps).toContainEqual({ name: "webpack", version: "5.0.0", category: "Build" });
  });

  it("should parse requirements.txt correctly", () => {
    const file = {
      path: "requirements.txt",
      type: "blob" as const,
      sha: "1",
      content: "numpy>=1.20.0\ntensorflow==2.5.0\npytest<7.0.0"
    };

    const deps = DependencyDetector.detect(file);
    
    expect(deps).toContainEqual({ name: "numpy", version: "1.20.0", category: "Direct" });
    expect(deps).toContainEqual({ name: "tensorflow", version: "2.5.0", category: "AI" });
    expect(deps).toContainEqual({ name: "pytest", version: "7.0.0", category: "Testing" });
  });
});
