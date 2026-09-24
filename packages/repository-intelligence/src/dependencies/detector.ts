import type { SnapshotFile } from "../knowledge-graph/types";

export interface Dependency {
  name: string;
  version: string;
  category: "Direct" | "Dev" | "Testing" | "Build" | "Database" | "AI" | "Other";
}

const TESTING_DEPS = new Set([
  "jest",
  "vitest",
  "mocha",
  "playwright",
  "cypress",
  "puppeteer",
  "pytest",
  "rspec",
  "junit",
]);
const BUILD_DEPS = new Set([
  "webpack",
  "vite",
  "rollup",
  "esbuild",
  "turbo",
  "nx",
  "tsc",
  "maven",
  "gradle",
  "make",
  "cmake",
]);
const DB_DEPS = new Set([
  "prisma",
  "typeorm",
  "mongoose",
  "sequelize",
  "pg",
  "mysql",
  "redis",
  "mongodb",
  "sqlalchemy",
]);
const AI_DEPS = new Set([
  "openai",
  "@anthropic-ai/sdk",
  "langchain",
  "tensorflow",
  "pytorch",
  "transformers",
  "huggingface",
]);

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
            deps.push({
              name: depName,
              version: version as string,
              category: this.categorize(depName, "Direct"),
            });
          });
        }
        if (pkg.devDependencies) {
          Object.entries(pkg.devDependencies).forEach(([depName, version]) => {
            deps.push({
              name: depName,
              version: version as string,
              category: this.categorize(depName, "Dev"),
            });
          });
        }
      } catch (e) {
        // invalid json
      }
    } else if (name === "requirements.txt") {
      // requirements.txt: line-based format, regex is appropriate
      const lines = file.content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) continue;
        const match = trimmed.match(/^([a-zA-Z0-9_\-\.]+)\s*[=<>~!]+\s*(.*)$/);
        if (match) {
          deps.push({
            name: match[1],
            version: match[2].trim(),
            category: this.categorize(match[1], "Direct"),
          });
        }
      }
    } else if (name === "Cargo.toml" || name === "pyproject.toml") {
      // Section-aware TOML parsing: only extract from dependency sections
      const DEPENDENCY_SECTIONS = new Set([
        "[dependencies]",
        "[dev-dependencies]",
        "[build-dependencies]",
        "[tool.poetry.dependencies]",
        "[tool.poetry.dev-dependencies]",
        "[project.dependencies]",
        "[project.optional-dependencies]",
      ]);
      // Metadata keys that should never be treated as dependencies
      const METADATA_KEYS = new Set([
        "name",
        "version",
        "edition",
        "description",
        "license",
        "authors",
        "readme",
        "homepage",
        "repository",
        "keywords",
        "categories",
        "workspace",
        "members",
        "exclude",
        "publish",
        "rust-version",
        "resolver",
        "build",
        "links",
        "requires-python",
        "classifiers",
      ]);

      const lines = file.content.split("\n");
      let inDependencySection = false;
      let currentCategory: "Direct" | "Dev" = "Direct";

      for (const line of lines) {
        const trimmed = line.trim();

        // Detect section headers
        if (trimmed.startsWith("[")) {
          const sectionLower = trimmed.toLowerCase();
          if (DEPENDENCY_SECTIONS.has(sectionLower)) {
            inDependencySection = true;
            currentCategory = sectionLower.includes("dev") ? "Dev" : "Direct";
          } else {
            inDependencySection = false;
          }
          continue;
        }

        if (!inDependencySection) continue;
        if (!trimmed || trimmed.startsWith("#")) continue;

        const tomlMatch = trimmed.match(/^([a-zA-Z0-9_\-]+)\s*=\s*(.+)$/);
        if (tomlMatch) {
          const depName = tomlMatch[1];
          if (METADATA_KEYS.has(depName.toLowerCase())) continue;

          // Extract version from value (handles both "1.0" and { version = "1.0", features = [...] })
          let version = tomlMatch[2].trim().replace(/^["']|["']$/g, "");
          const inlineVersionMatch = version.match(/version\s*=\s*["']([^"']+)["']/);
          if (inlineVersionMatch) {
            version = inlineVersionMatch[1];
          }
          deps.push({
            name: depName,
            version,
            category: this.categorize(depName, currentCategory),
          });
        }
      }
    } else if (name === "go.mod" || name === "pom.xml") {
      // go.mod and pom.xml: basic line-based extraction
      const lines = file.content.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("<!--")) continue;
        const match = trimmed.match(/^([a-zA-Z0-9_\-\.\/]+)\s+v?([a-zA-Z0-9_\-\.]+)/);
        if (match && match[1].includes("/")) {
          deps.push({
            name: match[1],
            version: match[2],
            category: this.categorize(match[1], "Direct"),
          });
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
