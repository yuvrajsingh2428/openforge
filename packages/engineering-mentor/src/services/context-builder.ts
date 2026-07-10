import { 
  SnapshotService, 
  KnowledgeGraphBuilder, 
  DependencyDetector, 
  ArchitectureDetector, 
  ContributorJourneyGenerator, 
  RepositoryMapGenerator, 
  AnalysisCache, 
  Graph,
  RepositorySnapshot
} from "@openforge/repository-intelligence";

export interface MentorContext {
  snapshot: RepositorySnapshot;
  graph: Graph;
  repoMap: any;
  journey: any[];
  architecture: any[];
  dependencies: any[];
  issue: {
    number: number;
    title: string;
    body: string;
  };
}

export class ContextBuilder {
  public static async build(owner: string, repo: string, issue: { number: number; title: string; body: string }): Promise<MentorContext> {
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

    return {
      snapshot: cacheEntry.snapshot,
      graph: cacheEntry.graph,
      repoMap,
      journey,
      architecture,
      dependencies,
      issue
    };
  }
}
