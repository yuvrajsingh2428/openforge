import type { Graph } from "../knowledge-graph/graph";
import type { Node } from "../knowledge-graph/types";

export interface JourneyStep {
  title: string;
  description: string;
  type: "Documentation" | "Architecture" | "EntryPoint" | "CoreModule" | "Tests" | "Action" | "Configuration" | "Example";
  nodeId?: string;
  url?: string;
}

export class ContributorJourneyGenerator {
  public static generate(graph: Graph, repoId: string): JourneyStep[] {
    const steps: JourneyStep[] = [];
    const nodes = Array.from(graph.nodes.values()).filter(n => n.id.startsWith(repoId));

    // 1. Documentation
    const docs = nodes.filter(n => n.type === "File" && (n.name.toLowerCase() === "readme.md" || n.name.toLowerCase() === "contributing.md"));
    if (docs.length > 0) {
      steps.push({
        title: "Read Documentation",
        description: "Start by reading the core project documentation.",
        type: "Documentation",
        nodeId: docs[0].id
      });
    }

    // 2. Configuration
    const configs = nodes.filter(n => n.type === "File" && (n.name.endsWith(".config.js") || n.name.endsWith(".json") || n.name.endsWith(".toml") || n.name === "Makefile"));
    if (configs.length > 0) {
      steps.push({
        title: "Review Configuration",
        description: "Understand the project setup and configuration files.",
        type: "Configuration",
        nodeId: configs.find(c => c.name === "package.json")?.id ?? configs[0].id
      });
    }

    // 3. Architecture
    const archDocs = nodes.filter(n => n.type === "File" && (n.name.toLowerCase() === "architecture.md" || n.name.toLowerCase() === "design.md"));
    if (archDocs.length > 0) {
      steps.push({
        title: "Understand Architecture",
        description: "Review high-level architectural decisions and diagrams.",
        type: "Architecture",
        nodeId: archDocs[0].id
      });
    } else {
      // Suggest looking at the repo root node architecture metadata
      steps.push({
        title: "Understand Architecture",
        description: "Review the high-level structure of the repository.",
        type: "Architecture",
        nodeId: repoId
      });
    }

    // 4. Entry Point
    const entryPoints = nodes.filter(n => n.type === "File" && (n.name === "index.ts" || n.name === "main.go" || n.name === "main.py" || n.name === "app.js"));
    if (entryPoints.length > 0) {
      steps.push({
        title: "Explore Entry Point",
        description: "See where the application initializes.",
        type: "EntryPoint",
        nodeId: entryPoints[0].id
      });
    }

    // 5. Core Module (Heuristic: Directory with most files or 'core'/'domain'/'shared')
    const dirs = nodes.filter(n => n.type === "Directory");
    const coreDir = dirs.find(d => d.name.toLowerCase() === "core" || d.name.toLowerCase() === "shared" || d.name.toLowerCase() === "domain") ?? dirs.find(d => d.name.toLowerCase() === "src");
    if (coreDir) {
      steps.push({
        title: "Dive into Core Module",
        description: "Understand the central domain or shared utilities of the project.",
        type: "CoreModule",
        nodeId: coreDir.id
      });
    }

    // 6. Tests
    const tests = nodes.filter(n => n.type === "Directory" && (n.name.toLowerCase() === "tests" || n.name.toLowerCase() === "__tests__"));
    if (tests.length > 0) {
      steps.push({
        title: "Review Tests",
        description: "Look at how the core modules are tested.",
        type: "Tests",
        nodeId: tests[0].id
      });
    }

    // 7. Examples
    const examples = nodes.filter(n => n.type === "Directory" && (n.name.toLowerCase() === "examples" || n.name.toLowerCase() === "demo"));
    if (examples.length > 0) {
      steps.push({
        title: "Run Examples",
        description: "Try running the example projects to see it in action.",
        type: "Example",
        nodeId: examples[0].id
      });
    }

    // 8. Action
    steps.push({
      title: "Find a Good First Issue",
      description: "Now you are ready! Find an issue labeled 'good first issue' or use OpenForge Recommendations.",
      type: "Action",
      nodeId: repoId
    });

    return steps;
  }
}
