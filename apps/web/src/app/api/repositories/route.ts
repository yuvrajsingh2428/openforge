import { getRepositoriesByNames } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/repositories:
 *   get:
 *     summary: Retrieve curated list of repositories
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter repositories by category
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const targetRepos = category
      ? CURATED_REPOSITORIES.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        )
      : CURATED_REPOSITORIES;

    const reposToFetch = targetRepos.length > 0 ? targetRepos : CURATED_REPOSITORIES;
    const repositories = await getRepositoriesByNames(reposToFetch);

    const enriched = repositories.map((repo) => {
      const config = CURATED_REPOSITORIES.find(
        (c) => c.owner === repo.owner?.login && c.name === repo.name
      );
      return { ...repo, category: config?.category ?? "Uncategorized" };
    });

    return standardResponse(enriched);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch repositories";
    return errorResponse(message, 500);
  }
}
