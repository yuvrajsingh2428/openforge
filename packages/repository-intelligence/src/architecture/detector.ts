import type { SnapshotFile } from "../knowledge-graph/types";

export interface ArchitecturePattern {
  name: string;
  confidence: number; // 0 to 1
  reasons: string[];
}

export class ArchitectureDetector {
  public static detect(files: SnapshotFile[]): ArchitecturePattern[] {
    const patterns: ArchitecturePattern[] = [];
    
    const monorepo = this.detectMonorepo(files);
    if (monorepo) patterns.push(monorepo);
    
    const microservices = this.detectMicroservices(files);
    if (microservices) patterns.push(microservices);
    
    const mvc = this.detectMVC(files);
    if (mvc) patterns.push(mvc);
    
    const clean = this.detectCleanArchitecture(files);
    if (clean) patterns.push(clean);
    
    const cli = this.detectCLI(files);
    if (cli) patterns.push(cli);

    const library = this.detectLibrary(files, patterns);
    if (library) patterns.push(library);

    // Filter out low confidence patterns to reduce noise
    return patterns.filter(p => p.confidence > 0.3).sort((a, b) => b.confidence - a.confidence);
  }

  private static detectMonorepo(files: SnapshotFile[]): ArchitecturePattern | null {
    const reasons: string[] = [];
    let score = 0;
    
    for (const file of files) {
      if (file.path === "turbo.json") { score += 0.5; reasons.push("Found turbo.json"); }
      if (file.path === "lerna.json") { score += 0.5; reasons.push("Found lerna.json"); }
      if (file.path === "pnpm-workspace.yaml") { score += 0.5; reasons.push("Found pnpm-workspace.yaml"); }
      if ((file.path.startsWith("packages/") || file.path === "packages") && file.type === "tree") { score += 0.2; reasons.push("Found packages/ directory"); }
      if ((file.path.startsWith("apps/") || file.path === "apps") && file.type === "tree") { score += 0.2; reasons.push("Found apps/ directory"); }
    }
    
    if (score === 0) return null;
    return { name: "Monorepo", confidence: Math.min(1, score), reasons };
  }

  private static detectMicroservices(files: SnapshotFile[]): ArchitecturePattern | null {
    const reasons: string[] = [];
    let score = 0;
    let dockerfileCount = 0;
    
    for (const file of files) {
      if (file.path === "docker-compose.yml" || file.path === "docker-compose.yaml") { score += 0.4; reasons.push("Found docker-compose file"); }
      if (file.path.endsWith("Dockerfile")) dockerfileCount++;
    }
    
    if (dockerfileCount > 1) {
      score += 0.4;
      reasons.push(`Found ${dockerfileCount} Dockerfiles`);
    } else if (dockerfileCount === 1) {
      score += 0.1;
    }
    
    if (score === 0) return null;
    return { name: "Microservices", confidence: Math.min(1, score), reasons };
  }

  private static detectMVC(files: SnapshotFile[]): ArchitecturePattern | null {
    const reasons: string[] = [];
    let score = 0;
    
    const hasModels = files.some(f => f.path.includes("models/") || f.path.includes("app/models/"));
    const hasViews = files.some(f => f.path.includes("views/") || f.path.includes("app/views/"));
    const hasControllers = files.some(f => f.path.includes("controllers/") || f.path.includes("app/controllers/"));
    
    if (hasModels) { score += 0.33; reasons.push("Found models directory"); }
    if (hasViews) { score += 0.33; reasons.push("Found views directory"); }
    if (hasControllers) { score += 0.33; reasons.push("Found controllers directory"); }
    
    if (score === 0) return null;
    return { name: "MVC", confidence: Math.min(1, score), reasons };
  }

  private static detectCleanArchitecture(files: SnapshotFile[]): ArchitecturePattern | null {
    const reasons: string[] = [];
    let score = 0;
    
    const hasDomain = files.some(f => f.path.includes("domain/") || f.path.includes("core/"));
    const hasApp = files.some(f => f.path.includes("application/") || f.path.includes("usecases/"));
    const hasInfra = files.some(f => f.path.includes("infrastructure/") || f.path.includes("adapters/"));
    
    if (hasDomain) { score += 0.35; reasons.push("Found domain/core directory"); }
    if (hasApp) { score += 0.35; reasons.push("Found application/usecases directory"); }
    if (hasInfra) { score += 0.30; reasons.push("Found infrastructure/adapters directory"); }
    
    if (score === 0) return null;
    return { name: "Clean Architecture", confidence: Math.min(1, score), reasons };
  }

  private static detectCLI(files: SnapshotFile[]): ArchitecturePattern | null {
    const reasons: string[] = [];
    let score = 0;
    
    if (files.some(f => f.path.startsWith("bin/") && f.type === "tree")) { score += 0.4; reasons.push("Found bin/ directory"); }
    if (files.some(f => f.path.startsWith("cmd/") && f.type === "tree")) { score += 0.5; reasons.push("Found cmd/ directory (common in Go CLIs)"); }
    
    // Naive file content check for Node CLIs in package.json would be better, but we don't always load blob contents here
    // unless it's done during dependency detection.
    
    if (score === 0) return null;
    return { name: "CLI", confidence: Math.min(1, score), reasons };
  }

  private static detectLibrary(files: SnapshotFile[], existingPatterns: ArchitecturePattern[]): ArchitecturePattern | null {
    // If it's heavily something else, it might not just be a library
    const hasStrongOtherPatterns = existingPatterns.some(p => p.confidence > 0.6 && p.name !== "Monorepo");
    if (hasStrongOtherPatterns) return null;

    const reasons: string[] = [];
    let score = 0;
    
    if (files.some(f => f.path === "lib" || f.path === "src/lib")) { score += 0.3; reasons.push("Found lib directory"); }
    if (files.some(f => f.path === "src/index.ts" || f.path === "src/index.js")) { score += 0.3; reasons.push("Found common library entry point"); }
    
    if (score === 0) return null;
    return { name: "Library", confidence: Math.min(0.8, score), reasons };
  }
}
