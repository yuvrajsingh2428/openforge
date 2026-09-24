import { Node, Edge, KnowledgeGraph, NodeType, EdgeType } from "./types";

export class Graph implements KnowledgeGraph {
  public nodes: Map<string, Node> = new Map();
  public edges: Edge[] = [];

  /** Adjacency list: nodeId → outgoing edges for O(1) lookups. */
  private outgoingEdges: Map<string, Edge[]> = new Map();
  /** Adjacency list: nodeId → incoming edges for O(1) lookups. */
  private incomingEdges: Map<string, Edge[]> = new Map();

  public addNode(node: Node): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    }
  }

  public addEdge(
    source: string,
    target: string,
    type: EdgeType,
    metadata?: Record<string, any>
  ): void {
    const edge: Edge = { source, target, type, metadata };
    this.edges.push(edge);

    // Maintain adjacency lists for O(1) edge lookups
    const outList = this.outgoingEdges.get(source);
    if (outList) {
      outList.push(edge);
    } else {
      this.outgoingEdges.set(source, [edge]);
    }

    const inList = this.incomingEdges.get(target);
    if (inList) {
      inList.push(edge);
    } else {
      this.incomingEdges.set(target, [edge]);
    }
  }

  public getNode(id: string): Node | undefined {
    return this.nodes.get(id);
  }

  public getNodesByType(type: NodeType): Node[] {
    const result: Node[] = [];
    for (const node of this.nodes.values()) {
      if (node.type === type) {
        result.push(node);
      }
    }
    return result;
  }

  public getIncomingEdges(nodeId: string, type?: EdgeType): Edge[] {
    const edges = this.incomingEdges.get(nodeId) ?? [];
    return type ? edges.filter((e) => e.type === type) : edges;
  }

  public getOutgoingEdges(nodeId: string, type?: EdgeType): Edge[] {
    const edges = this.outgoingEdges.get(nodeId) ?? [];
    return type ? edges.filter((e) => e.type === type) : edges;
  }

  public getNeighbors(nodeId: string, type?: EdgeType): Node[] {
    const outgoing = this.getOutgoingEdges(nodeId, type).map((e) => e.target);
    const incoming = this.getIncomingEdges(nodeId, type).map((e) => e.source);

    const neighborIds = new Set([...outgoing, ...incoming]);
    const neighbors: Node[] = [];

    for (const id of neighborIds) {
      const node = this.getNode(id);
      if (node) neighbors.push(node);
    }

    return neighbors;
  }

  /**
   * Returns a plain serializable object representation of the graph.
   * Avoids the double-conversion of JSON.stringify → JSON.parse.
   */
  public toJSON(): { nodes: [string, Node][]; edges: Edge[] } {
    return {
      nodes: Array.from(this.nodes.entries()),
      edges: this.edges,
    };
  }

  public serialize(): string {
    return JSON.stringify(this.toJSON());
  }

  public static deserialize(data: string): Graph {
    const parsed = JSON.parse(data);
    const graph = new Graph();
    for (const [id, node] of parsed.nodes) {
      graph.nodes.set(id, node);
    }
    for (const edge of parsed.edges) {
      graph.addEdge(edge.source, edge.target, edge.type, edge.metadata);
    }
    return graph;
  }
}
