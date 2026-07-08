import { Graph } from "./graph";
import type { RepositorySnapshot } from "./types";
import { ArchitectureDetector } from "../architecture/detector";
import { DependencyDetector } from "../dependencies/detector";
import { TechnologyDetector } from "../file-intelligence/detector";

export class KnowledgeGraphBuilder {
  public static build(snapshot: RepositorySnapshot): Graph {
    const graph = new Graph();
    
    const repoId = `github.com/${snapshot.owner}/${snapshot.repo}`;
    graph.addNode({ id: repoId, type: "Repository", name: snapshot.repo });

    for (const file of snapshot.tree) {
      const type = file.type === "tree" ? "Directory" : "File";
      const id = `${repoId}/${file.path}`;
      const name = file.path.split("/").pop() ?? file.path;
      
      graph.addNode({ id, type, name, metadata: { size: file.size } });

      // Link to parent
      const parentPath = file.path.substring(0, file.path.lastIndexOf("/"));
      const parentId = parentPath ? `${repoId}/${parentPath}` : repoId;
      graph.addEdge(parentId, id, "CONTAINS");
      
      // Basic classification
      if (type === "File") {
        if (name === "package.json" || name === "Cargo.toml" || name === "pyproject.toml" || name === "go.mod" || name === "pom.xml" || name === "requirements.txt") {
          const dependencies = DependencyDetector.detect(file);
          dependencies.forEach(dep => {
            const depId = `dep:${dep.name}`;
            graph.addNode({ id: depId, type: "Dependency", name: dep.name, metadata: { category: dep.category, version: dep.version } });
            graph.addEdge(id, depId, "DEPENDS_ON");
          });
        }
        
        if (name.toLowerCase().includes("readme") || name.toLowerCase().includes("architecture") || name.toLowerCase().includes("contributing")) {
          graph.addEdge(id, repoId, "DOCUMENTS");
        }
      }
    }

    const architectures = ArchitectureDetector.detect(snapshot.tree);
    architectures.forEach(arch => {
      // Just store architecture as metadata on the repo node
      const node = graph.getNode(repoId);
      if (node) {
        if (!node.metadata) node.metadata = {};
        if (!node.metadata.architectures) node.metadata.architectures = [];
        node.metadata.architectures.push(arch);
      }
    });
    
    const technologies = TechnologyDetector.detect(snapshot.tree);
    const repoNode = graph.getNode(repoId);
    if (repoNode) {
      if (!repoNode.metadata) repoNode.metadata = {};
      repoNode.metadata.technologies = technologies;
    }

    return graph;
  }
}
