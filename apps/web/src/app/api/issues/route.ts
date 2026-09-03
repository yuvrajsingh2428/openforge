import { getIssuesFromCuratedRepos } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/issues:
 *   get:
 *     summary: Retrieve issues from curated repositories
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter issues by repository category
 *       - in: query
 *         name: perRepo
 *         schema:
 *           type: integer
 *         description: Number of issues to fetch per repository (default 15)
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const perRepoParam = searchParams.get("perRepo");
    const perRepo = perRepoParam ? Math.min(Math.max(parseInt(perRepoParam, 10), 1), 50) : 15;

    const targetRepos = category
      ? CURATED_REPOSITORIES.filter(
          (r) => r.category.toLowerCase() === category.toLowerCase()
        )
      : CURATED_REPOSITORIES;

    const reposToFetch = targetRepos.length > 0 ? targetRepos : CURATED_REPOSITORIES;
    const issues = await getIssuesFromCuratedRepos(reposToFetch, perRepo);

    return standardResponse(issues);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch issues";
    return errorResponse(message, 500);
  }
}
