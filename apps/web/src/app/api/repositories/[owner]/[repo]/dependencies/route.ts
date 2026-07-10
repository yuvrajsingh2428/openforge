import { SnapshotService, KnowledgeGraphBuilder, DependencyDetector, AnalysisCache } from "@openforge/repository-intelligence";
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
    
    const deps = cacheEntry.snapshot.tree
      .filter(f => {
        const name = f.path.split("/").pop();
        return name && (name === "package.json" || name === "Cargo.toml" || name === "pyproject.toml" || name === "go.mod" || name === "pom.xml" || name === "requirements.txt");
      })
      .flatMap(f => DependencyDetector.detect(f));

    const uniqueDeps = Array.from(new Map(deps.map(d => [`${d.name}-${d.version}`, d])).values());
    return standardResponse(uniqueDeps);
  } catch (error: any) {
    console.error("Dependencies error:", error);
    return errorResponse(error.message, 500);
  }
}
