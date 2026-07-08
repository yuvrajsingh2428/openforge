export type NodeType = 
  | "Repository" 
  | "Directory" 
  | "File" 
  | "Dependency" 
  | "Module" 
  | "Test" 
  | "Documentation" 
  | "Example" 
  | "EntryPoint";

export type EdgeType = 
  | "CONTAINS" 
  | "DEPENDS_ON" 
  | "IMPLEMENTS" 
  | "TESTS" 
  | "DOCUMENTS";

export interface Node {
  id: string; // e.g. "github.com/owner/repo/src/index.ts"
  type: NodeType;
  name: string;
  metadata?: Record<string, any>;
}

export interface Edge {
  source: string; // Node ID
  target: string; // Node ID
  type: EdgeType;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraph {
  nodes: Map<string, Node>;
  edges: Edge[];
}

export interface RepositorySnapshot {
  owner: string;
  repo: string;
  tree: SnapshotFile[];
  fetchedAt: Date;
}

export interface SnapshotFile {
  path: string; // e.g. "src/index.ts"
  type: "tree" | "blob";
  sha: string;
  size?: number;
  content?: string; // Loaded on demand for manifests
}
