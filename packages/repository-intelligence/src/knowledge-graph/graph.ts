import { Node, Edge, KnowledgeGraph, NodeType, EdgeType } from './types';

export class Graph implements KnowledgeGraph {
  public nodes: Map<string, Node> = new Map();
  public edges: Edge[] = [];

  public addNode(node: Node): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
    }
  }

  public addEdge(source: string, target: string, type: EdgeType, metadata?: Record<string, any>): void {
    this.edges.push({ source, target, type, metadata });
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
    return this.edges.filter((e) => e.target === nodeId && (!type || e.type === type));
  }

  public getOutgoingEdges(nodeId: string, type?: EdgeType): Edge[] {
    return this.edges.filter((e) => e.source === nodeId && (!type || e.type === type));
  }
  
  public getNeighbors(nodeId: string, type?: EdgeType): Node[] {
    const outgoing = this.getOutgoingEdges(nodeId, type).map(e => e.target);
    const incoming = this.getIncomingEdges(nodeId, type).map(e => e.source);
    
    const neighborIds = new Set([...outgoing, ...incoming]);
    const neighbors: Node[] = [];
    
    for (const id of neighborIds) {
      const node = this.getNode(id);
      if (node) neighbors.push(node);
    }
    
    return neighbors;
  }

  public serialize(): string {
    return JSON.stringify({
      nodes: Array.from(this.nodes.entries()),
      edges: this.edges,
    });
  }

  public static deserialize(data: string): Graph {
    const parsed = JSON.parse(data);
    const graph = new Graph();
    graph.nodes = new Map(parsed.nodes);
    graph.edges = parsed.edges;
    return graph;
  }
}
