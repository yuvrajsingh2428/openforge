import { SnapshotService, KnowledgeGraphBuilder, ContributorJourneyGenerator, AnalysisCache } from "@openforge/repository-intelligence";
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
    
    const repoId = `github.com/${owner}/${repo}`;
    const journey = ContributorJourneyGenerator.generate(cacheEntry.graph, repoId);
    return standardResponse(journey);
  } catch (error: any) {
    console.error("Journey error:", error);
    return errorResponse(error.message, 500);
  }
}
