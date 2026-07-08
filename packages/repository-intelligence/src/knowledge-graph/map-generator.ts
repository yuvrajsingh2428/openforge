import type { Graph } from "./graph";
import type { Node } from "./types";

export interface RepositoryMap {
  directories: string[];
  entryPoints: string[];
  coreModules: string[];
}

export class RepositoryMapGenerator {
  public static generate(graph: Graph, repoId: string): RepositoryMap {
    const nodes = Array.from(graph.nodes.values()).filter(n => n.id.startsWith(repoId));

    const directories = nodes
      .filter(n => n.type === "Directory" && n.id.split("/").length <= repoId.split("/").length + 2) // Top-level and 1 level deep
      .map(n => n.id.replace(`${repoId}/`, ""));

    const entryPoints = nodes
      .filter(n => n.type === "File" && (n.name === "index.ts" || n.name === "main.go" || n.name === "app.js" || n.name === "server.js"))
      .map(n => n.id.replace(`${repoId}/`, ""));

    const coreModules = nodes
      .filter(n => n.type === "Directory" && (n.name === "src" || n.name === "core" || n.name === "lib" || n.name === "shared"))
      .map(n => n.id.replace(`${repoId}/`, ""));

    return {
      directories,
      entryPoints,
      coreModules,
    };
  }
}
