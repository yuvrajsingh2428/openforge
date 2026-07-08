import { describe, it, expect } from "vitest";
import { Graph } from "../src/knowledge-graph/graph";
import { ContributorJourneyGenerator } from "../src/journey/generator";

describe("Contributor Journey Generator", () => {
  it("should generate a sequential path based on knowledge graph contents", () => {
    const graph = new Graph();
    const repoId = "github.com/owner/repo";
    
    graph.addNode({ id: repoId, type: "Repository", name: "repo" });
    graph.addNode({ id: `${repoId}/README.md`, type: "File", name: "README.md" });
    graph.addNode({ id: `${repoId}/ARCHITECTURE.md`, type: "File", name: "ARCHITECTURE.md" });
    graph.addNode({ id: `${repoId}/src/index.ts`, type: "File", name: "index.ts" });
    graph.addNode({ id: `${repoId}/tests`, type: "Directory", name: "tests" });

    const journey = ContributorJourneyGenerator.generate(graph, repoId);
    
    expect(journey.length).toBeGreaterThan(3);
    expect(journey[0].type).toBe("Documentation");
    expect(journey.find(s => s.type === "Architecture")).toBeDefined();
    expect(journey.find(s => s.type === "EntryPoint")).toBeDefined();
    expect(journey[journey.length - 1].type).toBe("Action");
  });
});
