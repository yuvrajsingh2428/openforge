import { NextResponse } from "next/server";
import { SnapshotService, KnowledgeGraphBuilder, AnalysisCache } from "@openforge/repository-intelligence";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    
    let cacheEntry = AnalysisCache.get(owner, repo);
    if (!cacheEntry) {
      const snapshot = await SnapshotService.createSnapshot(owner, repo);
      const graph = KnowledgeGraphBuilder.build(snapshot);
      AnalysisCache.set(owner, repo, { snapshot, graph });
      cacheEntry = { snapshot, graph, fetchedAt: new Date() };
    }

    return NextResponse.json(JSON.parse(cacheEntry.graph.serialize()));
  } catch (error: any) {
    console.error("Knowledge Graph error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
