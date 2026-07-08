import type { SnapshotFile } from "../knowledge-graph/types";

export interface Technology {
  name: string;
  type: "Language" | "Framework" | "Library" | "Database" | "BuildTool" | "TestingFramework" | "CI";
}

export class TechnologyDetector {
  public static detect(files: SnapshotFile[]): Technology[] {
    const techMap = new Map<string, Technology>();

    const addTech = (t: Technology) => {
      techMap.set(`${t.type}:${t.name}`, t);
    };

    for (const file of files) {
      if (file.path.endsWith(".ts") || file.path.endsWith(".tsx")) addTech({ name: "TypeScript", type: "Language" });
      if (file.path.endsWith(".js") || file.path.endsWith(".jsx")) addTech({ name: "JavaScript", type: "Language" });
      if (file.path.endsWith(".go")) addTech({ name: "Go", type: "Language" });
      if (file.path.endsWith(".py")) addTech({ name: "Python", type: "Language" });
      if (file.path.endsWith(".rs")) addTech({ name: "Rust", type: "Language" });
      if (file.path.endsWith(".java")) addTech({ name: "Java", type: "Language" });
      if (file.path.endsWith(".rb")) addTech({ name: "Ruby", type: "Language" });
      if (file.path.endsWith(".php")) addTech({ name: "PHP", type: "Language" });
      if (file.path.endsWith(".html")) addTech({ name: "HTML", type: "Language" });
      if (file.path.endsWith(".css") || file.path.endsWith(".scss")) addTech({ name: "CSS", type: "Language" });

      const name = file.path.split("/").pop() ?? "";
      
      // Frameworks & Build Tools
      if (name === "next.config.js" || name === "next.config.ts" || name === "next.config.mjs") addTech({ name: "Next.js", type: "Framework" });
      if (name === "nuxt.config.js" || name === "nuxt.config.ts") addTech({ name: "Nuxt", type: "Framework" });
      if (name === "vue.config.js") addTech({ name: "Vue", type: "Framework" });
      if (name === "angular.json") addTech({ name: "Angular", type: "Framework" });
      if (name === "vite.config.js" || name === "vite.config.ts") addTech({ name: "Vite", type: "BuildTool" });
      if (name === "webpack.config.js") addTech({ name: "Webpack", type: "BuildTool" });
      if (name === "turbo.json") addTech({ name: "Turborepo", type: "BuildTool" });
      
      // CI
      if (file.path.startsWith(".github/workflows/")) addTech({ name: "GitHub Actions", type: "CI" });
      if (name === ".gitlab-ci.yml") addTech({ name: "GitLab CI", type: "CI" });
      if (name === ".travis.yml") addTech({ name: "Travis CI", type: "CI" });
      
      // Tests
      if (name.includes("jest.config")) addTech({ name: "Jest", type: "TestingFramework" });
      if (name.includes("vitest.config") || name.includes("vitest.workspace")) addTech({ name: "Vitest", type: "TestingFramework" });
      if (name.includes("playwright.config")) addTech({ name: "Playwright", type: "TestingFramework" });
      if (name.includes("cypress.json") || name.includes("cypress.config")) addTech({ name: "Cypress", type: "TestingFramework" });
    }

    return Array.from(techMap.values());
  }
}
