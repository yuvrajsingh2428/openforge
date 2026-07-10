import { NextResponse } from "next/server";
import { standardResponse, errorResponse } from "@/lib/api-helper";
import { 
  SnapshotService, 
  KnowledgeGraphBuilder, 
  DependencyDetector, 
  ArchitectureDetector, 
  ContributorJourneyGenerator, 
  RepositoryMapGenerator, 
  AnalysisCache 
} from "@openforge/repository-intelligence";

/**
 * @openapi
 * /api/repositories/{owner}/{repo}/intelligence:
 *   get:
 *     summary: Retrieve aggregated repository intelligence data
 *     parameters:
 *       - name: owner
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: repo
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params;
    if (!owner || !repo) {
      return errorResponse("Owner and Repo params are required", 400);
    }

    let cacheEntry = AnalysisCache.get(owner, repo);
    if (!cacheEntry) {
      const snapshot = await SnapshotService.createSnapshot(owner, repo);
      const graph = KnowledgeGraphBuilder.build(snapshot);
      AnalysisCache.set(owner, repo, { snapshot, graph });
      cacheEntry = { snapshot, graph, fetchedAt: new Date() };
    }

    const repoId = `github.com/${owner}/${repo}`;
    const repoMap = RepositoryMapGenerator.generate(cacheEntry.graph, repoId);
    const journey = ContributorJourneyGenerator.generate(cacheEntry.graph, repoId);
    const architecture = ArchitectureDetector.detect(cacheEntry.snapshot.tree);
    const dependenciesRaw = cacheEntry.snapshot.tree
      .filter(f => f.path && (f.path.endsWith("package.json") || f.path.endsWith("Cargo.toml") || f.path.endsWith("pyproject.toml") || f.path.endsWith("go.mod") || f.path.endsWith("pom.xml") || f.path.endsWith("requirements.txt")))
      .flatMap(f => DependencyDetector.detect(f));
    const dependencies = Array.from(new Map(dependenciesRaw.map(d => [`${d.name}-${d.version}`, d])).values());

    return standardResponse({
      graph: JSON.parse(cacheEntry.graph.serialize()),
      dependencies,
      architecture,
      journey,
      repoMap
    });
  } catch (error: any) {
    return errorResponse(error.message, 500);
  }
}
