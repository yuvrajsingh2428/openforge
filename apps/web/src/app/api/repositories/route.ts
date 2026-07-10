import { getRepositoriesByNames } from "@openforge/github-client";
import { CURATED_REPOSITORIES } from "@openforge/config";
import { standardResponse, errorResponse } from "@/lib/api-helper";

/**
 * @openapi
 * /api/repositories:
 *   get:
 *     summary: Retrieve curated list of repositories
 *     responses:
 *       200:
 *         description: Success
 */
export async function GET() {
  try {
    const repositories = await getRepositoriesByNames(CURATED_REPOSITORIES);

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
