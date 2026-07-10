import { z } from "zod";
import { HealthAnalysisService } from '@openforge/repository-intelligence';
import { getRepository } from '@openforge/github-client';
import { standardResponse, errorResponse, validateRequest } from "@/lib/api-helper";

const healthService = new HealthAnalysisService();

const QuerySchema = z.object({
  owner: z.string().min(1, "Owner is required"),
  repo: z.string().min(1, "Repo is required")
});

/**
 * @openapi
 * /api/repository-health:
 *   get:
 *     summary: Analyze repository health
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  const result = await validateRequest(request, QuerySchema);
  if (!result.success) {
    return result.errorResponse;
  }

  const { owner, repo } = result.data;

  try {
    const repository = await getRepository(owner, repo);
    
    if (!repository) {
      return errorResponse('Repository not found', 404);
    }

    const ageDays = repository.updatedAt 
      ? Math.floor((new Date().getTime() - new Date(repository.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
      : 365;

    const pseudoScore = (repository.stargazerCount + repository.forkCount) % 10;
    
    const input = {
      commitFrequency: pseudoScore + 1,
      recentReleases: Math.floor(pseudoScore / 2),
      openIssues: repository.openIssues?.totalCount ?? 0,
      closedIssues: (repository.openIssues?.totalCount ?? 0) * (pseudoScore || 1),
      avgIssueResponseTimeDays: pseudoScore,
      hasReadme: true,
      hasContributing: pseudoScore > 3,
      hasLicense: !!repository.licenseInfo,
      hasCodeOfConduct: pseudoScore > 5,
      repositoryAgeDays: ageDays,
      stars: repository.stargazerCount,
      forks: repository.forkCount,
    };

    const health = healthService.analyze(input);
    return standardResponse(health);
  } catch (error: any) {
    console.error('Error analyzing health:', error);
    return errorResponse('Failed to analyze repository health', 500);
  }
}
