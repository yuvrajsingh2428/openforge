import type { SnapshotFile } from "../knowledge-graph/types";

export interface Dependency {
  name: string;
  version: string;
  category: "Direct" | "Dev" | "Testing" | "Build" | "Database" | "AI" | "Other";
}

const TESTING_DEPS = new Set(["jest", "vitest", "mocha", "playwright", "cypress", "puppeteer", "pytest", "rspec", "junit"]);
const BUILD_DEPS = new Set(["webpack", "vite", "rollup", "esbuild", "turbo", "nx", "tsc", "maven", "gradle", "make", "cmake"]);
const DB_DEPS = new Set(["prisma", "typeorm", "mongoose", "sequelize", "pg", "mysql", "redis", "mongodb", "sqlalchemy"]);
const AI_DEPS = new Set(["openai", "@anthropic-ai/sdk", "langchain", "tensorflow", "pytorch", "transformers", "huggingface"]);

export class DependencyDetector {
  public static detect(file: SnapshotFile): Dependency[] {
    if (!file.content) return [];
    
    const deps: Dependency[] = [];
    const name = file.path.split("/").pop();
    
    if (name === "package.json") {
      try {
        const pkg = JSON.parse(file.content);
        if (pkg.dependencies) {
          Object.entries(pkg.dependencies).forEach(([depName, version]) => {
            deps.push({ name: depName, version: version as string, category: this.categorize(depName, "Direct") });
          });
        }
        if (pkg.devDependencies) {
          Object.entries(pkg.devDependencies).forEach(([depName, version]) => {
            deps.push({ name: depName, version: version as string, category: this.categorize(depName, "Dev") });
          });
        }
      } catch (e) {
        // invalid json
      }
    } else if (name === "requirements.txt" || name === "Cargo.toml" || name === "pyproject.toml" || name === "go.mod" || name === "pom.xml") {
      // Basic regex fallback for other manifests since the instruction said to use structured parsers where practical, regex for simple formats
      const lines = file.content.split("\n");
      for (const line of lines) {
        const match = line.match(/^([a-zA-Z0-9_\-]+)[=<>~]+(.*)$/); // simplistic for requirements.txt
        if (match) {
          deps.push({ name: match[1], version: match[2], category: this.categorize(match[1], "Direct") });
        } else {
          // For Cargo.toml / pyproject.toml simplistic matching
          const tomlMatch = line.match(/^([a-zA-Z0-9_\-]+)\s*=\s*"?([a-zA-Z0-9_\-\.]+)"?$/);
          if (tomlMatch) {
            deps.push({ name: tomlMatch[1], version: tomlMatch[2], category: this.categorize(tomlMatch[1], "Direct") });
          }
        }
      }
    }

    return deps;
  }

  private static categorize(name: string, defaultCat: "Direct" | "Dev"): Dependency["category"] {
    const lowerName = name.toLowerCase();
    if (TESTING_DEPS.has(lowerName)) return "Testing";
    if (BUILD_DEPS.has(lowerName)) return "Build";
    if (DB_DEPS.has(lowerName)) return "Database";
    if (AI_DEPS.has(lowerName)) return "AI";
    return defaultCat;
  }
}
