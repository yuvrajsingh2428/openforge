import { describe, it, expect } from "vitest";
import { Graph } from "../src/knowledge-graph/graph";
import { KnowledgeGraphBuilder } from "../src/knowledge-graph/builder";
import type { RepositorySnapshot } from "../src/knowledge-graph/types";

describe("Knowledge Graph", () => {
  it("should add and query nodes and edges correctly", () => {
    const graph = new Graph();
    
    graph.addNode({ id: "repo-1", type: "Repository", name: "test-repo" });
    graph.addNode({ id: "dir-1", type: "Directory", name: "src" });
    graph.addNode({ id: "file-1", type: "File", name: "index.ts" });
    
    graph.addEdge("repo-1", "dir-1", "CONTAINS");
    graph.addEdge("dir-1", "file-1", "CONTAINS");

    expect(graph.getNode("repo-1")).toBeDefined();
    expect(graph.getNodesByType("File")).toHaveLength(1);
    expect(graph.getOutgoingEdges("repo-1")).toHaveLength(1);
    expect(graph.getIncomingEdges("file-1")).toHaveLength(1);
    expect(graph.getNeighbors("dir-1")).toHaveLength(2);
  });

  it("should build a graph from snapshot files", () => {
    const snapshot: RepositorySnapshot = {
      owner: "test-owner",
      repo: "test-repo",
      fetchedAt: new Date(),
      tree: [
        { path: "package.json", type: "blob", sha: "1", content: '{"dependencies":{"react":"18.0.0"}}' },
        { path: "src", type: "tree", sha: "2" },
        { path: "src/index.ts", type: "blob", sha: "3" },
        { path: "turbo.json", type: "blob", sha: "4" }
      ]
    };

    const graph = KnowledgeGraphBuilder.build(snapshot);
    expect(graph.getNodesByType("Repository")).toHaveLength(1);
    expect(graph.getNodesByType("File")).toHaveLength(3);
    expect(graph.getNodesByType("Dependency")).toHaveLength(1);
  });
});
