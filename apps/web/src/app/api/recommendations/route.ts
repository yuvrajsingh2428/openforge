import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { generateRecommendations } from "@openforge/recommendation-engine";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/recommendations:
 *   get:
 *     summary: Generate recommendations from curated repositories
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  try {
    const issues = await getIssuesFromCuratedRepos(CURATED_REPOSITORIES, 10);
    
    const categoryMap = new Map<string, string>();
    for (const repo of CURATED_REPOSITORIES) {
      categoryMap.set(`${repo.owner}/${repo.name}`, repo.category);
    }

    const recommendations = generateRecommendations(issues, categoryMap);
    return standardResponse(recommendations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch recommendations";
    return errorResponse(message, 500);
  }
}
