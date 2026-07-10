import { SnapshotService, ArchitectureDetector, KnowledgeGraphBuilder, AnalysisCache } from "@openforge/repository-intelligence";
import { standardResponse, errorResponse } from "@/lib/api-helper";

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
    
    const architectures = ArchitectureDetector.detect(cacheEntry.snapshot.tree);
    return standardResponse(architectures);
  } catch (error: any) {
    console.error("Architecture error:", error);
    return errorResponse(error.message, 500);
  }
}
